package com.example.backend.controller;

import com.example.backend.dto.request.UserGameRequestDTO;
import com.example.backend.dto.response.UserGameResponseDTO;
import com.example.backend.service.UserGameService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-games")
public class UserGameController {

    private final UserGameService userGameService;

    public UserGameController(UserGameService userGameService) {
        this.userGameService = userGameService;
    }

    @GetMapping
    public List<UserGameResponseDTO> getAllUserGames() {
        return userGameService.getAllUserGames();
    }

    @GetMapping("/user/{userId}/game/{gameId}")
    public UserGameResponseDTO getUserGame(@PathVariable Long userId, @PathVariable Long gameId) {
        return userGameService.getUserGame(userId, gameId);
    }

    @PostMapping
    public ResponseEntity<UserGameResponseDTO> addUserGame(@RequestBody UserGameRequestDTO dto) {
        UserGameResponseDTO created = userGameService.addUserGame(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/user/{userId}/game/{gameId}")
    public UserGameResponseDTO updateUserGame(@PathVariable Long userId, @PathVariable Long gameId, @RequestBody UserGameRequestDTO dto) {
        return userGameService.updateUserGame(userId, gameId, dto);
    }

    @DeleteMapping("/user/{userId}/game/{gameId}")
    public ResponseEntity<Void> deleteUserGame(@PathVariable Long userId, @PathVariable Long gameId) {
        userGameService.deleteUserGame(userId, gameId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserGameResponseDTO>> getUserGameByUserId(@PathVariable Long userId) {
        return userGameService.findUserGamesByUserId(userId);
    }
}