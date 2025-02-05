package com.example.backend.dto;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;

public class IGDBGameDTO {

    private Integer id;
    private String name;
    private Double rating;
    private String summary;
    private CoverDTO cover;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
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
}