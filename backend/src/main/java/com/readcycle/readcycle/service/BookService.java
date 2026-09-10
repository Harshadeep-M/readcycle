package com.readcycle.readcycle.service;

import com.readcycle.readcycle.dto.BookRequestDTO;
import com.readcycle.readcycle.dto.BookResponseDTO;
import com.readcycle.readcycle.dto.PaginationResponseDTO;
import com.readcycle.readcycle.entity.Book;
import com.readcycle.readcycle.exception.ResourceNotFoundException;
import com.readcycle.readcycle.mapper.BookMapper;
import com.readcycle.readcycle.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.readcycle.readcycle.repository.UserRepository;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;
    @Autowired
    private UserRepository userRepository;

    // CREATE
    public BookResponseDTO createBook(BookRequestDTO request) {

        Book book = BookMapper.toEntity(request);

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        Long userId = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"))
                .getId();

        book.setOwnerId(userId);

        Book savedBook = bookRepository.save(book);

        return BookMapper.toResponseDTO(savedBook);
    }

    // GET ALL WITH PAGINATION + SORTING
    public PaginationResponseDTO<BookResponseDTO> getAllBooks(
            int page,
            int size,
            String sortBy,
            String direction) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Book> books = bookRepository.findAll(pageable);

        List<BookResponseDTO> responseList = new ArrayList<>();

        for (Book book : books.getContent()) {
            responseList.add(BookMapper.toResponseDTO(book));
        }

        return new PaginationResponseDTO<>(
                responseList,
                books.getNumber(),
                books.getTotalPages(),
                books.getTotalElements(),
                books.getSize(),
                books.isLast()
        );
    }

    // GET BY ID
    public BookResponseDTO getBookById(Long id) {

        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found"));

        return BookMapper.toResponseDTO(book);
    }

    // UPDATE
    public BookResponseDTO updateBook(Long id, BookRequestDTO request) {

        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found"));

        BookMapper.updateEntity(book, request);

        Book updatedBook = bookRepository.save(book);

        return BookMapper.toResponseDTO(updatedBook);
    }

    // DELETE
    public void deleteBook(Long id) {

        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found"));

        bookRepository.delete(book);
    }

    // SEARCH WITH PAGINATION + SORTING
    public PaginationResponseDTO<BookResponseDTO> searchBooks(
            String title,
            int page,
            int size,
            String sortBy,
            String direction) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Book> books = bookRepository.findByTitleContainingIgnoreCase(title, pageable);

        List<BookResponseDTO> responseList = new ArrayList<>();

        for (Book book : books.getContent()) {
            responseList.add(BookMapper.toResponseDTO(book));
        }

        return new PaginationResponseDTO<>(
                responseList,
                books.getNumber(),
                books.getTotalPages(),
                books.getTotalElements(),
                books.getSize(),
                books.isLast()
        );
    }
}