package com.example.backend.service;

import com.example.backend.dto.IGDB.IGDBGameDTO;
import com.example.backend.dto.request.GameRequestDTO;
import com.example.backend.dto.response.ArtworkResponseDTO;
import com.example.backend.dto.response.GameResponseDTO;
import com.example.backend.dto.response.GenreResponseDTO;
import com.example.backend.dto.response.ScreenshotResponseDTO;
import com.example.backend.mapper.ArtworkMapper;
import com.example.backend.mapper.GameMapper;
import com.example.backend.mapper.GenreMapper;
import com.example.backend.mapper.ScreenshotMapper;
import com.example.backend.model.Artwork;
import com.example.backend.model.Game;
import com.example.backend.model.Genre;
import com.example.backend.model.Screenshot;
import com.example.backend.repository.GameRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class GameService {

    private final GameRepository gameRepository;
    private final GenreService genreService;
    private final ArtworkService artworkService;
    private final ScreenshotService screenshotService;
    private final IGDBService igdbService;

    public GameService(GameRepository gameRepository, GenreService genreService, ArtworkService artworkService, ScreenshotService screenshotService, IGDBService igdbService) {
        this.gameRepository = gameRepository;
        this.genreService = genreService;
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

        // Fetch genre names or DTOs from IGDB
        List<GenreResponseDTO> genreDTOArray = igdbService.findGenresByIds(dto.getGenreIds());

        // Fetch artwork URLs or DTOs from IGDB
        List<ArtworkResponseDTO> artworkDTOArray = igdbService.findArtworksByGameId(dto.getId());

        // Fetch screenshot URLs or DTOs from IGDB
        List<ScreenshotResponseDTO> screenshotDTOArray = igdbService.findScreenshotsByGameId(dto.getId());

        Set<Genre> gameGenres = new HashSet<>();
        Set<Artwork> gameArtworks = new HashSet<>();
        Set<Screenshot> gameScreenshots = new HashSet<>();

        // Insert genres
        for (GenreResponseDTO genreDTO : genreDTOArray) {
            Optional<Genre> existingGenre = genreService.findByName(genreDTO.getName());

            Genre genre = existingGenre.orElseGet(() -> {
                Genre newGenre = GenreMapper.fromRequest(genreDTO);
                return genreService.createGenre(newGenre);
            });

            gameGenres.add(genre);
        }

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

        game.setGenres(gameGenres);
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

    public GameResponseDTO getFullGameInfoById(Long id) {
        IGDBGameDTO igdbDto = igdbService.findIGDBGameById(id);
        GameRequestDTO dto = GameMapper.fromIGDBToRequestDTO(igdbDto);
        Optional<Game> existingGame = gameRepository.findByIgdbId(dto.getId());

        if (existingGame.isPresent()) {
            return GameMapper.toDto(existingGame.get());
        }

        GameResponseDTO game = GameMapper.fromIGDBToResponseDTO(igdbDto);

        game.setGenreNames(igdbService.findGenresByIds(dto.getGenreIds())
                .stream()
                .map(GenreResponseDTO::getName)
                .collect(Collectors.toList()));
        game.setArtworkUrls(igdbService.findArtworksByGameId(dto.getId())
                .stream()
                .map(ArtworkResponseDTO::getUrl)
                .collect(Collectors.toList()));
        game.setScreenshotUrls(igdbService.findScreenshotsByGameId(dto.getId())
                .stream()
                .map(ScreenshotResponseDTO::getUrl)
                .collect(Collectors.toList()));

        return game;
    }

    public List<GameResponseDTO> getFullGameInfoByIds(List<Long> ids) {
        List<GameResponseDTO> results = new ArrayList<>();

        // Fetch all IGDB games at once
        List<IGDBGameDTO> igdbGames = igdbService.findIGDBGamesByIds(ids);

        for (IGDBGameDTO igdbDto : igdbGames) {
            GameRequestDTO dto = GameMapper.fromIGDBToRequestDTO(igdbDto);

            Optional<Game> existingGame = gameRepository.findByIgdbId(dto.getId());
            if (existingGame.isPresent()) {
                results.add(GameMapper.toDto(existingGame.get()));
                continue;
            }

            GameResponseDTO game = GameMapper.fromIGDBToResponseDTO(igdbDto);

            game.setGenreNames(
                    igdbService.findGenresByIds(dto.getGenreIds())
                            .stream()
                            .map(GenreResponseDTO::getName)
                            .collect(Collectors.toList())
            );

            game.setArtworkUrls(
                    igdbService.findArtworksByGameId(dto.getId())
                            .stream()
                            .map(ArtworkResponseDTO::getUrl)
                            .collect(Collectors.toList())
            );

            game.setScreenshotUrls(
                    igdbService.findScreenshotsByGameId(dto.getId())
                            .stream()
                            .map(ScreenshotResponseDTO::getUrl)
                            .collect(Collectors.toList())
            );

            results.add(game);
        }

        return results;
    }


    public List<GameResponseDTO> findFullGamesInfoByName(String name) {
        List<IGDBGameDTO> igdbList = igdbService.findGamesIdsByName(name);
        List<Long> ids = igdbList.stream()
                .map(IGDBGameDTO::getId)
                .toList();
        if (ids.isEmpty()) { return new ArrayList<>(); }
        return getFullGameInfoByIds(ids);
    }
}