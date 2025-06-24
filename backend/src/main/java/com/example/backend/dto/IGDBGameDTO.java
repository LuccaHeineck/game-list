package com.example.backend.dto;
import com.example.backend.model.Artwork;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;

public class IGDBGameDTO {

    private Long id;
    private String name;
    private Double rating;
    private String summary;
    private CoverDTO cover;
    private Long releaseDate;
    private ArrayList<Integer> artworksIds;


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

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public CoverDTO getCover() {
        return cover;
    }

    public void setCover(CoverDTO cover) {
        this.cover = cover;
    }

    public Long getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(Long releaseDate) {
        this.releaseDate = releaseDate;
    }

    public ArrayList<Integer> getArtworksIds() {
        return artworksIds;
    }

    public void setArtworksIds(ArrayList<Integer> artworksIds) {
        this.artworksIds = artworksIds;
    }
}