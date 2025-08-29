package com.example.backend.dto.IGDB;

import com.example.backend.dto.response.GenreResponseDTO;
import com.example.backend.dto.response.VideoResponseDTO;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.List;

public class IGDBGameDTO {

    private Long id;
    private String name;
    private Double rating;
    private String summary;
    private String storyline;
    private CoverDTO cover;
    @JsonProperty("first_release_date")
    private Long releaseDate;
    private List<GenreResponseDTO> genres;
    @JsonProperty("artworks")
    private ArrayList<Integer> artworksIds;
    @JsonProperty("videos")
    private ArrayList<VideoResponseDTO> videos;
    @JsonProperty("game_type")
    private GameTypeDTO gameType;
    @JsonProperty("platforms")
    private ArrayList<PlatformDTO> platforms;
    @JsonProperty("involved_companies")
    private ArrayList<InvolvedCompanyDTO> involvedCompanies;

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

    public List<GenreResponseDTO> getGenres() {
        return genres;
    }

    public void setGenres(List<GenreResponseDTO> genres) {
        this.genres = genres;
    }

    public ArrayList<Integer> getArtworksIds() {
        return artworksIds;
    }

    public void setArtworksIds(ArrayList<Integer> artworksIds) {
        this.artworksIds = artworksIds;
    }

    public ArrayList<VideoResponseDTO> getVideos() {
        return videos;
    }

    public void setVideos(ArrayList<VideoResponseDTO> videos) {
        this.videos = videos;
    }

    public GameTypeDTO getGameType() {
        return gameType;
    }

    public void setGameType(GameTypeDTO gameType) {
        this.gameType = gameType;
    }

    public ArrayList<PlatformDTO> getPlatforms() {
        return platforms;
    }

    public void setPlatforms(ArrayList<PlatformDTO> platforms) {
        this.platforms = platforms;
    }

    public ArrayList<InvolvedCompanyDTO> getInvolvedCompanies() {
        return involvedCompanies;
    }

    public void setInvolvedCompanies(ArrayList<InvolvedCompanyDTO> involvedCompanies) {
        this.involvedCompanies = involvedCompanies;
    }

    public String getStoryline() {
        return storyline;
    }

    public void setStoryline(String storyline) {
        this.storyline = storyline;
    }
}