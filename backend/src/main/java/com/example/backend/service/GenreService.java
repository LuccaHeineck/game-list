package com.example.backend.service;

import com.example.backend.dto.response.GameResponseDTO;
import com.example.backend.dto.response.GenreResponseDTO;
import com.example.backend.dto.response.ScreenshotResponseDTO;
import com.example.backend.mapper.GenreMapper;
import com.example.backend.mapper.ScreenshotMapper;
import com.example.backend.model.Genre;
import com.example.backend.model.Screenshot;
import com.example.backend.repository.GenreRepository;
import com.example.backend.repository.ScreenshotRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GenreService {

    private final GenreRepository genreRepository;

    public GenreService(GenreRepository genreRepository) {
        this.genreRepository = genreRepository;
    }

    public List<GenreResponseDTO> getAllGenres() {
        return genreRepository.findAll()
                .stream()
                .map(GenreMapper::toDto)
                .toList();
    }

    public Genre getGenreById(Long id) {
        return genreRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Genre not found with id: " + id));
    }

    public Optional<Genre> findByName(String name) {
        return genreRepository.findByName(name);
    }

    public Genre createGenre(Genre genre) {
        return genreRepository.save(genre);
    }

    public void createGenres(List<Genre> genres) {
        genreRepository.saveAll(genres);
    }
}
