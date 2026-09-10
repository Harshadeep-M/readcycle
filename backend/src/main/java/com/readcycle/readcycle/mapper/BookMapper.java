package com.readcycle.readcycle.mapper;

import com.readcycle.readcycle.dto.BookRequestDTO;
import com.readcycle.readcycle.dto.BookResponseDTO;
import com.readcycle.readcycle.entity.Book;

public class BookMapper {

    // Convert Request DTO -> Entity
    public static Book toEntity(BookRequestDTO request) {

        Book book = new Book();

        book.setTitle(request.getTitle());
        book.setAuthor(request.getAuthor());
        book.setDescription(request.getDescription());
        book.setAvailable(request.getAvailable());

        return book;
    }

    // Update existing Entity from Request DTO
    public static void updateEntity(Book book, BookRequestDTO request) {

        book.setTitle(request.getTitle());
        book.setAuthor(request.getAuthor());
        book.setDescription(request.getDescription());
        book.setAvailable(request.getAvailable());
    }

    // Convert Entity -> Response DTO
    public static BookResponseDTO toResponseDTO(Book book) {

        return new BookResponseDTO(
                book.getId(),
                book.getTitle(),
                book.getAuthor(),
                book.getDescription(),
                book.isAvailable(),
                book.getOwnerId()
        );
    }
}