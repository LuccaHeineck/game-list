package com.example.backend.mapper;

import com.example.backend.dto.response.StatusResponseDTO;
import com.example.backend.model.Status;

public class StatusMapper {
    public static StatusResponseDTO toDto(Status status) {
        StatusResponseDTO dto = new StatusResponseDTO();
        dto.setStatusId(status.getStatusId());
        dto.setName(status.getName());
        return dto;
    }
}