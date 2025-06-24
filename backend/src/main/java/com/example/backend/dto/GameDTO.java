package com.example.backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

public class GameDTO {

    private Long id;
    private String name;
    private String summary;
    private LocalDate releaseDate;
    private String coverUrl;
    private Double rating;
    private LocalDateTime createdAt;
    private List<Long> userGames; // List of user game IDs (assuming you want just the IDs)
    private Set<Long> artworkIds; // Set of artwork IDs

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public LocalDate getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(LocalDate releaseDate) {
        this.releaseDate = releaseDate;
    }

    public String getCoverUrl() {
        return coverUrl;
    }

    public void setCoverUrl(String coverUrl) {
        this.coverUrl = coverUrl;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<Long> getUserGames() {
        return userGames;
    }

    public void setUserGames(List<Long> userGames) {
        this.userGames = userGames;
    }

    public Set<Long> getArtworkIds() {
        return artworkIds;
    }

    public void setArtworkIds(Set<Long> artworkIds) {
        this.artworkIds = artworkIds;
    }
}