package com.readcycle.readcycle.dto;

public class BookResponseDTO {

    private Long id;
    private String title;
    private String author;
    private String description;
    private Boolean available;
    private Long ownerId;

    public BookResponseDTO() {
    }

    public BookResponseDTO(
            Long id,
            String title,
            String author,
            String description,
            Boolean available,
            Long ownerId) {

        this.id = id;
        this.title = title;
        this.author = author;
        this.description = description;
        this.available = available;
        this.ownerId = ownerId;
    }

    // Getters

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getAuthor() {
        return author;
    }

    public String getDescription() {
        return description;
    }

    public Boolean getAvailable() {
        return available;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    // Setters

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setAvailable(Boolean available) {
        this.available = available;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }
}