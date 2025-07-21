package com.example.backend.mapper;


import com.example.backend.dto.response.ArtworkResponseDTO;
import com.example.backend.dto.response.GenreResponseDTO;
import com.example.backend.dto.response.ScreenshotResponseDTO;
import com.example.backend.model.Artwork;
import com.example.backend.model.Genre;
import com.example.backend.model.Screenshot;

public class GenreMapper {
    public static GenreResponseDTO toDto(Genre genre) {
        GenreResponseDTO dto = new GenreResponseDTO();
        dto.setId(genre.getId());
        dto.setName(genre.getName());
        return dto;
    }

    public static Genre fromRequest(GenreResponseDTO genreResponseDTO) {
        Genre genre = new Genre();
        genre.setName(genreResponseDTO.getName());
        return genre;
    }
}