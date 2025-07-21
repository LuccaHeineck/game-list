package com.example.backend.service;

import com.example.backend.dto.response.ScreenshotResponseDTO;
import com.example.backend.mapper.ScreenshotMapper;
import com.example.backend.model.Screenshot;
import com.example.backend.repository.ScreenshotRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ScreenshotService {

    private final ScreenshotRepository screenshotRepository;

    public ScreenshotService(ScreenshotRepository screenshotRepository) {
        this.screenshotRepository = screenshotRepository;
    }

    public List<ScreenshotResponseDTO> getAllScreenshot() {
        return screenshotRepository.findAll()
                .stream()
                .map(ScreenshotMapper::toDto)
                .toList();
    }

    public Screenshot getScreenshotById(Long id) {
        return screenshotRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Screenshot not found with id: " + id));
    }

    public Optional<Screenshot> findByUrl(String url) {
        return screenshotRepository.findByUrl(url);
    }

    public Screenshot createScreenshot(Screenshot screenshot) {
        return screenshotRepository.save(screenshot);
    }

    public void createScreenshots(List<Screenshot> screenshots) {
        screenshotRepository.saveAll(screenshots);
    }
}
