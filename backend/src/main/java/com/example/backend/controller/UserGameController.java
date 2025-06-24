package com.example.backend.controller;

import com.example.backend.dto.UserDTO;
import com.example.backend.dto.UserGameDTO;
import com.example.backend.service.UserGameService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/list")
public class UserGameController {

    private final UserGameService userGameService;

    public UserGameController(UserGameService userGameService) {
        this.userGameService = userGameService;
    }

    @GetMapping
    public ResponseEntity<List<UserGameDTO>> getUserGames() {
        return ResponseEntity.ok(userGameService.getAllUserGames());
    }

    @PostMapping
    public ResponseEntity<UserGameDTO> createUser(@RequestBody UserGameDTO userGameDTO) {
        UserGameDTO createdUserGame = userGameService.createUserGame(userGameDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUserGame);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserGameDTO> updateUserGame(@PathVariable Integer id, @RequestBody UserGameDTO userGameDTO) {
        return ResponseEntity.ok(userGameService.updateUserGame(id, userGameDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserGame(@PathVariable Integer id) {
        userGameService.deleteUserGame(id);
        return ResponseEntity.noContent().build();
    }
}
