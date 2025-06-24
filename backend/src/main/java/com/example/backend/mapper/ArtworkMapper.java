package com.example.backend.mapper;


import com.example.backend.dto.response.ArtworkResponseDTO;
import com.example.backend.model.Artwork;

public class ArtworkMapper {
    public static ArtworkResponseDTO toDto(Artwork artwork) {
        ArtworkResponseDTO dto = new ArtworkResponseDTO();
        dto.setId(artwork.getId());
        dto.setUrl(artwork.getUrl());
        return dto;
    }
}