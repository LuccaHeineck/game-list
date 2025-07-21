package com.example.backend.service;

import com.example.backend.dto.IGDB.IGDBGameDTO;
import com.example.backend.dto.request.GameRequestDTO;
import com.example.backend.dto.response.ArtworkResponseDTO;
import com.example.backend.dto.response.GameResponseDTO;
import com.example.backend.dto.response.ScreenshotResponseDTO;
import com.example.backend.mapper.ArtworkMapper;
import com.example.backend.mapper.GameMapper;
import com.example.backend.mapper.ScreenshotMapper;
import com.example.backend.model.Artwork;
import com.example.backend.model.Game;
import com.example.backend.model.Screenshot;
import com.example.backend.repository.GameRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneId;
import java.util.*;

@Service
public class GameService {

    private final GameRepository gameRepository;
    private final ArtworkService artworkService;
    private final ScreenshotService screenshotService;
    private final IGDBService igdbService;

    public GameService(GameRepository gameRepository, ArtworkService artworkService, ScreenshotService screenshotService, IGDBService igdbService) {
        this.gameRepository = gameRepository;
        this.artworkService = artworkService;
        this.screenshotService = screenshotService;
        this.igdbService = igdbService;
    }

    public List<GameResponseDTO> getAllGames() {
        return gameRepository.findAll()
                .stream()
                .map(GameMapper::toDto)
                .toList();
    }

    public GameResponseDTO getGameById(Long id) {
        Game game = gameRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Game not found with id: " + id));
        return GameMapper.toDto(game);
    }

    public GameResponseDTO getOrCreateGame(Long id) {
        IGDBGameDTO igdbDto = igdbService.findIGDBGameById(id);
        GameRequestDTO dto = GameMapper.fromIGDBToRequestDTO(igdbDto);

        Optional<Game> existingGame = gameRepository.findByIgdbId(dto.getId());

        if (existingGame.isPresent()) {
            return GameMapper.toDto(existingGame.get());
        }

        // Create Game entity from DTO
        Game game = GameMapper.fromRequest(dto);

        // Fetch artwork URLs or DTOs from IGDB
        List<ArtworkResponseDTO> artworkDTOArray = igdbService.findArtworksByGameId(dto.getId());

        // Fetch screenshot URLs or DTOs from IGDB
        List<ScreenshotResponseDTO> screenshotDTOArray = igdbService.findScreenshotsByGameId(dto.getId());

        Set<Artwork> gameArtworks = new HashSet<>();
        Set<Screenshot> gameScreenshots = new HashSet<>();

        // Insert artworks
        for (ArtworkResponseDTO artworkDTO : artworkDTOArray) {
            Optional<Artwork> existingArtwork = artworkService.findByUrl(artworkDTO.getUrl());

            Artwork artwork = existingArtwork.orElseGet(() -> {
                Artwork newArtwork = ArtworkMapper.fromRequest(artworkDTO);
                return artworkService.createArtwork(newArtwork);
            });

            gameArtworks.add(artwork);
        }

        // Insert screenshots
        for (ScreenshotResponseDTO screenshotDTO : screenshotDTOArray) {
            Optional<Screenshot> existingScreenshot = screenshotService.findByUrl(screenshotDTO.getUrl());

            Screenshot screenshot = existingScreenshot.orElseGet(() -> {
                Screenshot newScreenshot = ScreenshotMapper.fromRequest(screenshotDTO);
                return screenshotService.createScreenshot(newScreenshot);
            });

            gameScreenshots.add(screenshot);
        }

        // Set artworks on game
        game.setArtworks(gameArtworks);
        game.setScreenshots(gameScreenshots);

        Game savedGame = gameRepository.save(game);

        return GameMapper.toDto(savedGame);
    }


    public GameResponseDTO updateGame(Long id, GameRequestDTO dto) {
        Game game = gameRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Game not found with id: " + id));
        game.setName(dto.getName());
        game.setSummary(dto.getSummary());
        game.setReleaseDate(
                Instant.ofEpochSecond(dto.getReleaseDate())
                        .atZone(ZoneId.systemDefault())
                        .toLocalDate()
        );
        game.setCoverUrl(dto.getCover().getUrl());
        game.setRating(dto.getRating());
        Game updatedGame = gameRepository.save(game);
        return GameMapper.toDto(updatedGame);
    }

    public void deleteGame(Long id) {
        gameRepository.deleteById(id);
    }
}