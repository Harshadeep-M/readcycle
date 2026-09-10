package com.readcycle.readcycle.service;

import com.readcycle.readcycle.dto.ExchangeRequestDTO;
import com.readcycle.readcycle.dto.ExchangeResponseDTO;
import com.readcycle.readcycle.entity.Book;
import com.readcycle.readcycle.entity.ExchangeRequest;
import com.readcycle.readcycle.enums.ExchangeStatus;
import com.readcycle.readcycle.exception.BadRequestException;
import com.readcycle.readcycle.exception.ResourceNotFoundException;
import com.readcycle.readcycle.mapper.ExchangeMapper;
import com.readcycle.readcycle.repository.BookRepository;
import com.readcycle.readcycle.repository.ExchangeRequestRepository;
import com.readcycle.readcycle.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ExchangeRequestService {

    private final ExchangeRequestRepository exchangeRequestRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    public ExchangeRequestService(
            ExchangeRequestRepository exchangeRequestRepository,
            BookRepository bookRepository,
            UserRepository userRepository) {

        this.exchangeRequestRepository = exchangeRequestRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
    }

    // CREATE EXCHANGE REQUEST
    public ExchangeResponseDTO createExchangeRequest(
            ExchangeRequestDTO request) {

        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Book not found"));

        if (!book.isAvailable()) {
            throw new BadRequestException(
                    "Book is not available for exchange.");
        }

        Long currentUserId = getCurrentUserId();

        // Prevent requesting your own book
        if (book.getOwnerId().equals(currentUserId)) {
            throw new BadRequestException(
                    "You cannot request your own book.");
        }

        // Prevent duplicate pending requests
        if (exchangeRequestRepository
                .existsByRequesterIdAndBookIdAndStatus(
                        currentUserId,
                        request.getBookId(),
                        ExchangeStatus.PENDING)) {

            throw new BadRequestException(
                    "You already have a pending request for this book."
            );
        }

        ExchangeRequest exchangeRequest = new ExchangeRequest();

        // Use authenticated user instead of trusting requesterId
        // from the frontend
        exchangeRequest.setRequesterId(currentUserId);

        exchangeRequest.setOwnerId(book.getOwnerId());
        exchangeRequest.setBookId(book.getId());
        exchangeRequest.setStatus(ExchangeStatus.PENDING);
        exchangeRequest.setRequestDate(LocalDateTime.now());

        ExchangeRequest savedRequest =
                exchangeRequestRepository.save(exchangeRequest);

        return ExchangeMapper.toResponseDTO(savedRequest);
    }

    // GET ALL REQUESTS
    public List<ExchangeResponseDTO> getAllExchangeRequests() {

        List<ExchangeResponseDTO> responseList =
                new ArrayList<>();

        for (ExchangeRequest request :
                exchangeRequestRepository.findAll()) {

            responseList.add(
                    ExchangeMapper.toResponseDTO(request)
            );
        }

        return responseList;
    }

    // GET REQUEST BY ID
    public ExchangeResponseDTO getExchangeRequestById(Long id) {

        ExchangeRequest request =
                exchangeRequestRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Exchange Request not found"));

        return ExchangeMapper.toResponseDTO(request);
    }

    // ACCEPT REQUEST
    public ExchangeResponseDTO acceptExchangeRequest(Long id) {

        return updateStatus(
                id,
                ExchangeStatus.ACCEPTED
        );
    }

    // REJECT REQUEST
    public ExchangeResponseDTO rejectExchangeRequest(Long id) {

        return updateStatus(
                id,
                ExchangeStatus.REJECTED
        );
    }

    // PRIVATE HELPER
    private ExchangeResponseDTO updateStatus(
            Long id,
            ExchangeStatus status) {

        ExchangeRequest request =
                exchangeRequestRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Exchange Request not found"));

        Long currentUserId = getCurrentUserId();

        // Only the book owner can accept or reject
        if (!request.getOwnerId().equals(currentUserId)) {

            throw new BadRequestException(
                    "Only the book owner can update this exchange request."
            );
        }

        request.setStatus(status);

        ExchangeRequest updatedRequest =
                exchangeRequestRepository.save(request);

        return ExchangeMapper.toResponseDTO(updatedRequest);
    }

    // GET CURRENT AUTHENTICATED USER ID
    private Long getCurrentUserId() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"))
                .getId();
    }
    public void cancelExchangeRequest(Long id) {

        ExchangeRequest request =
                exchangeRequestRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Exchange Request not found"));

        Long currentUserId = getCurrentUserId();

        if (!request.getRequesterId().equals(currentUserId)) {
            throw new BadRequestException(
                    "Only the requester can cancel this exchange request."
            );
        }

        if (request.getStatus() != ExchangeStatus.PENDING) {
            throw new BadRequestException(
                    "Only pending exchange requests can be cancelled."
            );
        }

        exchangeRequestRepository.delete(request);
    }

}