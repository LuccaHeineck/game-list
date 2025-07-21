package com.example.backend.mapper;


import com.example.backend.dto.response.ArtworkResponseDTO;
import com.example.backend.dto.response.ScreenshotResponseDTO;
import com.example.backend.model.Artwork;
import com.example.backend.model.Screenshot;

public class ScreenshotMapper {
    public static ScreenshotResponseDTO toDto(Screenshot screenshot) {
        ScreenshotResponseDTO dto = new ScreenshotResponseDTO();
        dto.setId(screenshot.getId());
        dto.setUrl(screenshot.getUrl());
        return dto;
    }

    public static Screenshot fromRequest(ScreenshotResponseDTO screenshotResponseDTO) {
        Screenshot screenshot = new Screenshot();
        screenshot.setUrl(screenshotResponseDTO.getUrl());
        return screenshot;
    }
}