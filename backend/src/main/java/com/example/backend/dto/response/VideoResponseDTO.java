package com.example.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public class VideoResponseDTO {
    public Long id;
    @JsonProperty("video_id")
    public String videoId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getVideoId() {
        return videoId;
    }

    public void setVideoId(String videoId) {
        this.videoId = videoId;
    }
}
