package com.example.backend.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class UserGameResponseDTO {
    private Long userId;
    private GameResponseDTO game;
    private Long gameId;
    private Double rating;
    private Integer statusId;
    private String statusName;
    private LocalDate completionDate;
    private LocalDateTime createdAt;

    // Getters and setters

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public GameResponseDTO getGame() {
        return game;
    }

    public void setGame(GameResponseDTO game) {
        this.game = game;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Integer getStatusId() {
        return statusId;
    }

    public void setStatusId(Integer statusId) {
        this.statusId = statusId;
    }

    public String getStatusName() {
        return statusName;
    }

    public void setStatusName(String statusName) {
        this.statusName = statusName;
    }

    public LocalDate getCompletionDate() {
        return completionDate;
    }

    public void setCompletionDate(LocalDate completionDate) {
        this.completionDate = completionDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Long getGameId() {
        return gameId;
    }

    public void setGameId(Long gameId) {
        this.gameId = gameId;
    }
}
