package com.example.backend.service;

import com.example.backend.dto.response.ArtworkResponseDTO;
import com.example.backend.mapper.ArtworkMapper;
import com.example.backend.model.Artwork;
import com.example.backend.repository.ArtworkRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ArtworkService {

    private final ArtworkRepository artworkRepository;

    public ArtworkService(ArtworkRepository artworkRepository) {
        this.artworkRepository = artworkRepository;
    }

    public List<ArtworkResponseDTO> getAllArtwork() {
        return artworkRepository.findAll()
                .stream()
                .map(ArtworkMapper::toDto)
                .toList();
    }

    public ArtworkResponseDTO getArtworkById(Long id) {
        Artwork artwork = artworkRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Artwork not found with id: " + id));
        return ArtworkMapper.toDto(artwork);
    }
}
