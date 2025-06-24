package com.example.backend.service;

import com.example.backend.dto.response.StatusResponseDTO;
import com.example.backend.mapper.StatusMapper;
import com.example.backend.model.Status;
import com.example.backend.repository.StatusRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StatusService {

    private final StatusRepository statusRepository;

    public StatusService(StatusRepository statusRepository) {
        this.statusRepository = statusRepository;
    }

    public List<StatusResponseDTO> getAllStatuses() {
        return statusRepository.findAll()
                .stream()
                .map(StatusMapper::toDto)
                .toList();
    }

    public StatusResponseDTO getStatusById(Integer id) {
        Status status = statusRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Status not found with id: " + id));
        return StatusMapper.toDto(status);
    }
}

