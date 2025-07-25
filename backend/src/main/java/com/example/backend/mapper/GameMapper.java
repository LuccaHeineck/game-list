package com.example.backend.mapper;

import com.example.backend.dto.IGDB.IGDBGameDTO;
import com.example.backend.dto.request.GameRequestDTO;
import com.example.backend.dto.response.GameResponseDTO;
import com.example.backend.model.Artwork;
import com.example.backend.model.Game;
import com.example.backend.model.Genre;
import com.example.backend.model.Screenshot;

import java.time.Instant;
import java.time.ZoneId;
import java.util.stream.Collectors;

public class GameMapper {

    public static GameResponseDTO toDto(Game game) {
        GameResponseDTO dto = new GameResponseDTO();
        dto.setId(game.getIgdbId());
        dto.setName(game.getName());
        dto.setSummary(game.getSummary());
        dto.setReleaseDate(game.getReleaseDate());
        dto.setCoverUrl(game.getCoverUrl());
        dto.setRating(game.getRating());
        dto.setCreatedAt(game.getCreatedAt());

        // Convert genre entities to list of names
        if (game.getGenres() != null) {
            dto.setGenreNames(
                    game.getGenres()
                            .stream()
                            .map(Genre::getName)
                            .collect(Collectors.toList())
            );
        }

        // Convert artwork entities to list of URLs
        if (game.getArtworks() != null) {
            dto.setArtworkUrls(
                    game.getArtworks()
                            .stream()
                            .map(Artwork::getUrl)
                            .collect(Collectors.toList())
            );
        }

        // Convert screenshot entities to list of URLs
        if (game.getScreenshots() != null) {
            dto.setScreenshotUrls(
                    game.getScreenshots()
                            .stream()
                            .map(Screenshot::getUrl)
                            .collect(Collectors.toList())
            );
        }

        return dto;
    }

    public static Game fromRequest(GameRequestDTO dto) {
        Game game = new Game();
        game.setIgdbId(dto.getId());
        game.setName(dto.getName());
        game.setSummary(dto.getSummary());
        game.setReleaseDate(
                Instant.ofEpochSecond(dto.getReleaseDate())
                        .atZone(ZoneId.systemDefault())
                        .toLocalDate()
        );
        game.setCoverUrl(dto.getCover().getUrl());
        game.setRating(dto.getRating());
        game.setCreatedAt(java.time.LocalDateTime.now());
        return game;
    }

    public static GameRequestDTO fromIGDBToRequestDTO(IGDBGameDTO game) {
        GameRequestDTO dto = new GameRequestDTO();
        dto.setId(game.getId());
        dto.setName(game.getName());
        dto.setSummary(game.getSummary());
        dto.setReleaseDate(game.getReleaseDate());
        dto.setCover(game.getCover());
        dto.setRating(game.getRating());
        dto.setGenreIds(game.getGenreIds());
        return dto;
    }

    public static GameResponseDTO fromIGDBToResponseDTO(IGDBGameDTO game) {
        GameResponseDTO dto = new GameResponseDTO();
        dto.setId(game.getId());
        dto.setName(game.getName());
        dto.setSummary(game.getSummary());
        if (game.getReleaseDate() != null) {
            dto.setReleaseDate(
                    Instant.ofEpochSecond(game.getReleaseDate())
                            .atZone(ZoneId.systemDefault())
                            .toLocalDate()
            );
        }
        if (game.getCover() != null) dto.setCoverUrl(game.getCover().getUrl());
        dto.setRating(game.getRating());
        return dto;
    }
}