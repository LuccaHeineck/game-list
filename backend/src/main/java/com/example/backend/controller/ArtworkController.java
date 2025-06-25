package com.example.backend.controller;

import com.example.backend.dto.response.ArtworkResponseDTO;
import com.example.backend.service.ArtworkService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/artworks")
public class ArtworkController {

    private final ArtworkService artworkService;

    public ArtworkController(ArtworkService artworkService) {
        this.artworkService = artworkService;
    }

    @GetMapping
    public List<ArtworkResponseDTO> getAllArtworks() {
        return artworkService.getAllArtwork();
    }

    @GetMapping("/{id}")
    public ArtworkResponseDTO getArtworkById(@PathVariable Long id) {
        return artworkService.getArtworkById(id);
    }
}
