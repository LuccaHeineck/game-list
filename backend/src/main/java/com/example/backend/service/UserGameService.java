package com.example.backend.service;

import com.example.backend.dto.request.UserGameRequestDTO;
import com.example.backend.dto.response.GameResponseDTO;
import com.example.backend.dto.response.UserGameResponseDTO;
import com.example.backend.mapper.GameMapper;
import com.example.backend.mapper.UserGameMapper;
import com.example.backend.model.Game;
import com.example.backend.model.Status;
import com.example.backend.model.User;
import com.example.backend.model.UserGame;
import com.example.backend.repository.GameRepository;
import com.example.backend.repository.StatusRepository;
import com.example.backend.repository.UserGameRepository;
import com.example.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
@Service
public class UserGameService {

    private final UserGameRepository userGameRepository;
    private final UserRepository userRepository;
    private final GameRepository gameRepository;
    private final StatusRepository statusRepository;
    private final GameService gameService;

    public UserGameService(UserGameRepository userGameRepository,
                           UserRepository userRepository,
                           GameRepository gameRepository,
                           StatusRepository statusRepository, GameService gameService) {
        this.userGameRepository = userGameRepository;
        this.userRepository = userRepository;
        this.gameRepository = gameRepository;
        this.statusRepository = statusRepository;
        this.gameService = gameService;
    }

    public List<UserGameResponseDTO> getAllUserGames() {
        return userGameRepository.findAll()
                .stream()
                .map(UserGameMapper::toDto)
                .toList();
    }

    public UserGameResponseDTO getUserGame(Long userId, Long gameId) {
        UserGame userGame = userGameRepository.findByUserIdAndGameId(userId, gameId)
                .orElseThrow(() -> new EntityNotFoundException("UserGame not found"));
        return UserGameMapper.toDto(userGame);
    }

    public UserGameResponseDTO addUserGame(UserGameRequestDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        Game game = gameService.getOrCreateGame(dto.getGameId()); // change this to return game so mapping is not transient
        Status status = statusRepository.findById(dto.getStatusId())
                .orElseThrow(() -> new EntityNotFoundException("Status not found"));

        Optional<UserGame> existing = userGameRepository.findByUserIdAndGameId(user.getId(), game.getId());
        if (existing.isPresent()) {
            throw new IllegalStateException("User already has this game added.");
        }

        dto.setCompletionDate(java.time.LocalDate.now());
        dto.setCreatedAt(java.time.LocalDateTime.now());

        UserGame userGame = UserGameMapper.fromRequest(dto, user, game, status);
        UserGame saved = userGameRepository.save(userGame); // breaks
        return UserGameMapper.toDto(saved);
    }

    public UserGameResponseDTO updateUserGame(Long userId, Long gameId, UserGameRequestDTO dto) {
        UserGame userGame = userGameRepository.findByUserIdAndGameId(userId, gameId)
                .orElseThrow(() -> new EntityNotFoundException("UserGame not found"));

        if (dto.getRating() != null) userGame.setRating(dto.getRating());
        if (dto.getCompletionDate() != null) userGame.setCompletionDate(dto.getCompletionDate());
        if (dto.getStatusId() != null) {
            Status status = statusRepository.findById(dto.getStatusId())
                    .orElseThrow(() -> new EntityNotFoundException("Status not found"));
            userGame.setStatus(status);
        }

        UserGame updated = userGameRepository.save(userGame);
        return UserGameMapper.toDto(updated);
    }

    public void deleteUserGame(Long userId, Long gameId) {
        userGameRepository.deleteByUserIdAndGameId(userId, gameId);
    }

    public ResponseEntity<List<UserGameResponseDTO>> findUserGamesByUserId(Long userId) {
        List<UserGameResponseDTO> dtos = userGameRepository.findByUserId(userId).stream()
                .map(UserGameMapper::toDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }
}
