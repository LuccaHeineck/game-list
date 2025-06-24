package com.example.backend.mapper;

import com.example.backend.dto.request.GameRequestDTO;
import com.example.backend.dto.response.GameResponseDTO;
import com.example.backend.model.Game;

import java.util.stream.Collectors;

public class GameMapper {

    public static GameResponseDTO toDto(Game game) {
        GameResponseDTO dto = new GameResponseDTO();
        dto.setId(game.getId());
        dto.setName(game.getName());
        dto.setSummary(game.getSummary());
        dto.setReleaseDate(game.getReleaseDate());
        dto.setCoverUrl(game.getCoverUrl());
        dto.setRating(game.getRating());
        dto.setCreatedAt(game.getCreatedAt());

        // Convert artwork entities to list of URLs
        if (game.getArtworks() != null) {
            dto.setArtworkUrls(
                    game.getArtworks()
                            .stream()
                            .map(artwork -> artwork.getUrl())
                            .collect(Collectors.toList())
            );
        }

        return dto;
    }

    public static Game fromRequest(GameRequestDTO dto) {
        Game game = new Game();
        game.setName(dto.getName());
        game.setSummary(dto.getSummary());
        game.setReleaseDate(dto.getReleaseDate());
        game.setCoverUrl(dto.getCoverUrl());
        game.setRating(dto.getRating());
        game.setCreatedAt(java.time.LocalDateTime.now());
        return game;
    }
}