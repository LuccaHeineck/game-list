package com.example.backend.controller;

import com.example.backend.dto.IGDB.IGDBGameDTO;
import com.example.backend.dto.response.ArtworkResponseDTO;
import com.example.backend.dto.response.GameResponseDTO;
import com.example.backend.model.Game;
import com.example.backend.service.IGDBService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
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

    @GetMapping("/games-genres")
    public List<IGDBGameDTO> searchGamesByGenre(@RequestParam String genreId) {
        int limit = 12;
        return igdBservice.findGamesByGenre(genreId, limit);
    }

    @GetMapping("/games-by-genres")
    public Map<Integer, List<IGDBGameDTO>> getGamesByGenres() {
        Map<Integer, Integer> genreIdToLimit = Map.of(
                5, 15,
                8, 15,
                9, 15,
                10, 15,
                12, 15,
                15, 15,
                32, 15,
                31, 15
        );

        Map<Integer, List<IGDBGameDTO>> gamesByGenre = new HashMap<>();

        for (Map.Entry<Integer, Integer> entry : genreIdToLimit.entrySet()) {
            int genreId = entry.getKey();
            int limit = entry.getValue();
            List<IGDBGameDTO> games = igdBservice.findGamesByGenre(String.valueOf(genreId), limit);
            gamesByGenre.put(genreId, games);
        }

        return gamesByGenre;
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
