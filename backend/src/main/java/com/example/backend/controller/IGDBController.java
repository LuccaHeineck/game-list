package com.example.backend.controller;

import com.example.backend.dto.IGDB.IGDBGameDTO;
import com.example.backend.service.IGDBService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class IGDBController {

    private final IGDBService igdBservice;

    public IGDBController(IGDBService igdBservice) {
        this.igdBservice = igdBservice;
    }

    @GetMapping
    public List<IGDBGameDTO> searchGamesByName(@RequestParam String name) {
        return igdBservice.findGamesByName(name);
    }
}
