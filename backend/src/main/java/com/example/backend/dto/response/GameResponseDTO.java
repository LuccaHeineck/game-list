package com.example.backend.dto.response;

import com.example.backend.dto.IGDB.HLTBDTO;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class GameResponseDTO {
    private Long id;
    private String name;
    private String summary;
    private LocalDate releaseDate;
    private String coverUrl;
    private Double rating;
    private LocalDateTime createdAt;
    private String gameType;
    private String storyline;

    private List<String> genreNames; // List of genre names for the game
    private List<String> artworkUrls; // List of artwork URLs for the game
    private List<String> videoUrls; // List of videos URLs for the game
    private List<String> screenshotUrls; // List of screenshot URLs for the game
    private List<String> platforms; // List of platforms for the game
    private List<String> publishers; // List of publishers for the game
    private List<String> developers; // List of developers for the game

    private HLTBDTO hltb;
    // Getters and setters

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

    public List<String> getGenreNames() {
        return genreNames;
    }

    public void setGenreNames(List<String> genreNames) {
        this.genreNames = genreNames;
    }

    public List<String> getArtworkUrls() {
        return artworkUrls;
    }

    public void setArtworkUrls(List<String> artworkUrls) {
        this.artworkUrls = artworkUrls;
    }

    public List<String> getScreenshotUrls() {
        return screenshotUrls;
    }

    public void setScreenshotUrls(List<String> screenshotUrls) {
        this.screenshotUrls = screenshotUrls;
    }

    public List<String> getVideoUrls() {
        return videoUrls;
    }

    public void setVideoUrls(List<String> videoUrls) {
        this.videoUrls = videoUrls;
    }

    public String getGameType() {
        return gameType;
    }

    public void setGameType(String gameType) {
        this.gameType = gameType;
    }

    public List<String> getPlatforms() {
        return platforms;
    }

    public void setPlatforms(List<String> platforms) {
        this.platforms = platforms;
    }

    public List<String> getPublishers() {
        return publishers;
    }

    public void setPublishers(List<String> publishers) {
        this.publishers = publishers;
    }

    public List<String> getDevelopers() {
        return developers;
    }

    public void setDevelopers(List<String> developers) {
        this.developers = developers;
    }

    public HLTBDTO getHltb() {
        return hltb;
    }

    public void setHltb(HLTBDTO hltb) {
        this.hltb = hltb;
    }

    public String getStoryline() {
        return storyline;
    }

    public void setStoryline(String storyline) {
        this.storyline = storyline;
    }
}