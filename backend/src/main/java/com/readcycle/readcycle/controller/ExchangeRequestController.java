package com.readcycle.readcycle.controller;

import com.readcycle.readcycle.dto.ExchangeRequestDTO;
import com.readcycle.readcycle.dto.ExchangeResponseDTO;
import com.readcycle.readcycle.service.ExchangeRequestService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/exchange")
public class ExchangeRequestController {

    private final ExchangeRequestService exchangeRequestService;

    public ExchangeRequestController(ExchangeRequestService exchangeRequestService) {
        this.exchangeRequestService = exchangeRequestService;
    }

    // CREATE EXCHANGE REQUEST
    @PostMapping
    public ExchangeResponseDTO createExchangeRequest(
            @Valid @RequestBody ExchangeRequestDTO request) {

        return exchangeRequestService.createExchangeRequest(request);
    }

    // GET ALL REQUESTS
    @GetMapping
    public List<ExchangeResponseDTO> getAllExchangeRequests() {
        return exchangeRequestService.getAllExchangeRequests();
    }

    // GET REQUEST BY ID
    @GetMapping("/{id}")
    public ExchangeResponseDTO getExchangeRequestById(@PathVariable Long id) {
        return exchangeRequestService.getExchangeRequestById(id);
    }

    // ACCEPT REQUEST
    @PutMapping("/{id}/accept")
    public ExchangeResponseDTO acceptExchangeRequest(@PathVariable Long id) {
        return exchangeRequestService.acceptExchangeRequest(id);
    }

    // REJECT REQUEST
    @PutMapping("/{id}/reject")
    public ExchangeResponseDTO rejectExchangeRequest(@PathVariable Long id) {
        return exchangeRequestService.rejectExchangeRequest(id);
    }
    @DeleteMapping("/{id}")
    public String cancelExchangeRequest(@PathVariable Long id) {
        exchangeRequestService.cancelExchangeRequest(id);
        return "Exchange request cancelled successfully.";
    }
}