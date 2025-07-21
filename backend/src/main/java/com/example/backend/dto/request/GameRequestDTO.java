package com.example.backend.dto.request;

import com.example.backend.dto.IGDB.CoverDTO;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;
import java.util.ArrayList;

public class GameRequestDTO {
    private Long id;
    private String name;
    private String summary;
    @JsonProperty("first_release_date")
    private Long releaseDate;
    private CoverDTO cover;
    private Double rating;
    private ArrayList<Integer> genreIds;

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

    public Long getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(Long releaseDate) {
        this.releaseDate = releaseDate;
    }

    public CoverDTO getCover() {
        return cover;
    }

    public void setCover(CoverDTO cover) {
        this.cover = cover;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public ArrayList<Integer> getGenreIds() {
        return genreIds;
    }

    public void setGenreIds(ArrayList<Integer> genreIds) {
        this.genreIds = genreIds;
    }
}