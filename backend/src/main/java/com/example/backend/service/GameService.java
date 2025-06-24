package com.example.backend.service;

import com.example.backend.dto.request.GameRequestDTO;
import com.example.backend.dto.response.GameResponseDTO;
import com.example.backend.mapper.GameMapper;
import com.example.backend.model.Game;
import com.example.backend.repository.GameRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GameService {

    private final GameRepository gameRepository;

    public GameService(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
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

    public GameResponseDTO createGame(GameRequestDTO dto) {
        Game game = GameMapper.fromRequest(dto);
        Game savedGame = gameRepository.save(game);
        return GameMapper.toDto(savedGame);
    }

    public GameResponseDTO updateGame(Long id, GameRequestDTO dto) {
        Game game = gameRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Game not found with id: " + id));
        game.setName(dto.getName());
        game.setSummary(dto.getSummary());
        game.setReleaseDate(dto.getReleaseDate());
        game.setCoverUrl(dto.getCoverUrl());
        game.setRating(dto.getRating());
        Game updatedGame = gameRepository.save(game);
        return GameMapper.toDto(updatedGame);
    }

    public void deleteGame(Long id) {
        gameRepository.deleteById(id);
    }
}