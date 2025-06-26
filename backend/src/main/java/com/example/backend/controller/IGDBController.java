package com.example.backend.controller;

import com.example.backend.dto.IGDB.IGDBGameDTO;
import com.example.backend.dto.response.ArtworkResponseDTO;
import com.example.backend.dto.response.GameResponseDTO;
import com.example.backend.model.Game;
import com.example.backend.service.IGDBService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/IGDB")
public class IGDBController {

    private final IGDBService igdBservice;

    public IGDBController(IGDBService igdBservice) {
        this.igdBservice = igdBservice;
    }

    @GetMapping("/games")
    public List<IGDBGameDTO> searchGamesByName(@RequestParam String name) {
        return igdBservice.findGamesByName(name);
    }

    @GetMapping("/games/{igdbId}")
    public GameResponseDTO getGameByIgdbId(@PathVariable Long igdbId) {
        return igdBservice.findGameById(igdbId);
    }

    @GetMapping("/artworks")
    public List<ArtworkResponseDTO> searchArtworksByGameID(@RequestParam Long id) {
        return igdBservice.findArtworksByGameId(id);
    }

//    @GetMapping("/artwork-id")
//    public ArtworkResponseDTO searchArtworkByID(@RequestParam Long id) {
//        return igdBservice.findArtworksByGameId(id);
//    }
}
