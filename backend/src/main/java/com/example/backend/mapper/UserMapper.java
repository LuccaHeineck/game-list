package com.example.backend.mapper;

import com.example.backend.dto.request.UserRequestDTO;
import com.example.backend.dto.response.UserResponseDTO;
import com.example.backend.model.User;

import java.time.LocalDateTime;

public class UserMapper {

    public static UserResponseDTO toDto(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }

    public static User fromRequest(UserRequestDTO requestDTO, String passwordHash) {
        User user = new User();
        user.setUsername(requestDTO.getUsername());
        user.setEmail(requestDTO.getEmail());
        user.setPasswordHash(passwordHash);
        user.setCreatedAt(LocalDateTime.now());
        return user;
    }
}