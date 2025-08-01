package com.example.backend.mapper;

import com.example.backend.dto.request.UserGameRequestDTO;
import com.example.backend.dto.response.UserGameResponseDTO;
import com.example.backend.model.Game;
import com.example.backend.model.Status;
import com.example.backend.model.User;
import com.example.backend.model.UserGame;

public class UserGameMapper {

    public static UserGameResponseDTO toDto(UserGame userGame) {
        UserGameResponseDTO dto = new UserGameResponseDTO();
        dto.setUserId(userGame.getUser().getId());
        dto.setGameId(userGame.getGame().getIgdbId());
        dto.setRating(userGame.getRating());
        dto.setStatusId(userGame.getStatus().getStatusId());
        dto.setStatusName(userGame.getStatus().getName());
        dto.setCompletionDate(userGame.getCompletionDate());
        dto.setCreatedAt(userGame.getCreatedAt());
        return dto;
    }

    public static UserGame fromRequest(UserGameRequestDTO dto, User user, Game game, Status status) {
        UserGame userGame = new UserGame();
        userGame.setUser(user);
        userGame.setGame(game);
        userGame.setRating(dto.getRating());
        userGame.setStatus(status);
        userGame.setCompletionDate(dto.getCompletionDate());
        userGame.setCreatedAt(dto.getCreatedAt());
        return userGame;
    }
}
