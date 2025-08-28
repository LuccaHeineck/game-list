package com.example.backend.service;

import com.example.backend.dto.IGDB.IGDBGameDTO;
import com.example.backend.dto.response.ArtworkResponseDTO;
import com.example.backend.dto.response.GameResponseDTO;
import com.example.backend.dto.response.GenreResponseDTO;
import com.example.backend.dto.response.ScreenshotResponseDTO;
import com.example.backend.mapper.ArtworkMapper;
import com.example.backend.mapper.GameMapper;
import com.example.backend.model.Artwork;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class IGDBService {

    private final ArtworkService artworkService;
    @Value("${access.token}")
    private String accessToken;
    @Value("${client.id}")
    private String clientId;

    private final RestTemplate restTemplate;

    public IGDBService(RestTemplate restTemplate, ArtworkService artworkService) {
        this.restTemplate = restTemplate;
        this.artworkService = artworkService;
    }

    public List<IGDBGameDTO> findGamesByName(String query) {
        String url = "https://api.igdb.com/v4/games";
        HttpHeaders headers = createHeaders();

        String body = "search \"" + query + "\"; fields id,name,rating,summary,cover.url,first_release_date,artworks; where game_type = (1,8,10,9,0);";

        HttpEntity<String> entity = new HttpEntity<>(body, headers);

        ResponseEntity<IGDBGameDTO[]> response = restTemplate.postForEntity(url, entity, IGDBGameDTO[].class);

        if (response.getBody() != null) {
            IGDBGameDTO[] gameDTOArray = response.getBody();
            List<IGDBGameDTO> gameDTOList = Arrays.asList(gameDTOArray);
            return gameDTOList;
        } else {
            return Collections.emptyList();
        }
    }

    public List<IGDBGameDTO> findGamesIdsByName(String query) {
        String url = "https://api.igdb.com/v4/games";
        HttpHeaders headers = createHeaders();

        String body = "search \"" + query + "\"; fields id;";

        HttpEntity<String> entity = new HttpEntity<>(body, headers);

        ResponseEntity<IGDBGameDTO[]> response = restTemplate.postForEntity(url, entity, IGDBGameDTO[].class);

        if (response.getBody() != null) {
            IGDBGameDTO[] gameDTOArray = response.getBody();
            List<IGDBGameDTO> gameDTOList = Arrays.asList(gameDTOArray);
            return gameDTOList;
        } else {
            return Collections.emptyList();
        }
    }

    public List<GenreResponseDTO> findGenresByIds(List<Integer> ids) {
        if (ids == null || ids.isEmpty()) {
            return Collections.emptyList();
        }

        String url = "https://api.igdb.com/v4/genres";
        HttpHeaders headers = createHeaders();

        // Convert list of IDs to comma-separated string
        String joinedIds = ids.stream()
                .map(String::valueOf)
                .collect(Collectors.joining(","));

        // Build IGDB query to fetch genres by ID
        String body = "fields name; where id = (" + joinedIds + ");";

        HttpEntity<String> entity = new HttpEntity<>(body, headers);

        ResponseEntity<GenreResponseDTO[]> response = restTemplate.postForEntity(url, entity, GenreResponseDTO[].class);

        if (response.getBody() != null) {
            return Arrays.asList(response.getBody());
        } else {
            return Collections.emptyList();
        }
    }


    public List<ArtworkResponseDTO> findArtworksByGameId(Long id) {
        String url = "https://api.igdb.com/v4/artworks";
        HttpHeaders headers = createHeaders();

        String body = "fields image_id; where game = " + id.toString() + ";";

        HttpEntity<String> entity = new HttpEntity<>(body, headers);

        ResponseEntity<ArtworkResponseDTO[]> response = restTemplate.postForEntity(url, entity, ArtworkResponseDTO[].class);

        if (response.getBody() != null) {
            List<ArtworkResponseDTO> artworkDTOArray = Arrays.stream(response.getBody()).toList();

            return artworkDTOArray;
        } else {
            return Collections.emptyList();
        }
    }

    public List<ScreenshotResponseDTO> findScreenshotsByGameId(Long id) {
        String url = "https://api.igdb.com/v4/screenshots";
        HttpHeaders headers = createHeaders();

        String body = "fields image_id; where game = " + id.toString() + ";";

        HttpEntity<String> entity = new HttpEntity<>(body, headers);

        ResponseEntity<ScreenshotResponseDTO[]> response = restTemplate.postForEntity(url, entity, ScreenshotResponseDTO[].class);

        if (response.getBody() != null) {
            List<ScreenshotResponseDTO> screenshotDTOArray = Arrays.stream(response.getBody()).toList();

            return screenshotDTOArray;
        } else {
            return Collections.emptyList();
        }
    }

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);
        headers.add("Client-ID", clientId);
        return headers;
    }

    public GameResponseDTO findGameById(Long id) {
        String url = "https://api.igdb.com/v4/games";
        HttpHeaders headers = createHeaders();

        String body = "where id = " + id + "; fields id,name,rating,summary,cover.url,first_release_date,artworks,videos.video_id;";

        HttpEntity<String> entity = new HttpEntity<>(body, headers);

        ResponseEntity<IGDBGameDTO[]> response = restTemplate.postForEntity(url, entity, IGDBGameDTO[].class);

        IGDBGameDTO[] games = response.getBody();

        if (games != null && games.length > 0) {
            List<ArtworkResponseDTO> artworks = new ArrayList<>();
            artworks = findArtworksByGameId(games[0].getId());

            List<String> artworksUrls = artworks.stream()
                    .map(ArtworkResponseDTO::getUrl)
                    .toList();

            GameResponseDTO gameResponseDTO = new GameResponseDTO();
            gameResponseDTO = GameMapper.fromIGDBToResponseDTO(games[0]);
            gameResponseDTO.setArtworkUrls(artworksUrls);
            return gameResponseDTO;
        } else {
            throw new NoSuchElementException("Game with IGDB ID " + id + " not found");
        }
    }

    public IGDBGameDTO findIGDBGameById(Long id) {
        String url = "https://api.igdb.com/v4/games";
        HttpHeaders headers = createHeaders();

        String body = "where id = " + id + "; fields id,name,rating,summary,genres.name,cover.url,first_release_date,artworks,videos.video_id;";

        HttpEntity<String> entity = new HttpEntity<>(body, headers);

        ResponseEntity<IGDBGameDTO[]> response = restTemplate.postForEntity(url, entity, IGDBGameDTO[].class);

        IGDBGameDTO[] games = response.getBody();

        if (games != null && games.length > 0) {
            return games[0];
        } else {
            throw new NoSuchElementException("Game with IGDB ID " + id + " not found");
        }
    }

    public List<IGDBGameDTO> findIGDBGamesByIds(List<Long> ids) {
        String url = "https://api.igdb.com/v4/games";
        HttpHeaders headers = createHeaders();

        if (ids == null || ids.isEmpty()) {
            return Collections.emptyList();
        }

        // Build comma-separated list: (123, 456, 789)
        String idList = ids.stream()
                .map(String::valueOf)
                .collect(Collectors.joining(", "));

        String body = String.format(
                "where id = (%s);\nfields id, name, rating, summary, genres, cover.url, first_release_date, artworks;",
                idList
        );

        HttpEntity<String> entity = new HttpEntity<>(body, headers);

        ResponseEntity<IGDBGameDTO[]> response = restTemplate.postForEntity(
                url, entity, IGDBGameDTO[].class
        );

        IGDBGameDTO[] games = response.getBody();

        if (games != null && games.length > 0) {
            return Arrays.asList(games);
        } else {
            return Collections.emptyList();
        }
    }

    public List<IGDBGameDTO> findGamesByGenre(String genreId, int limit) {
        String url = "https://api.igdb.com/v4/games";
        HttpHeaders headers = createHeaders();

        String body = "fields id,name,rating,summary,cover.url,first_release_date,genres.name;" +
                " where game_type = 0 & genres = (" + genreId + ");" +
                " sort total_rating_count desc;" +
                " limit " + limit + ";";


        HttpEntity<String> entity = new HttpEntity<>(body, headers);

        ResponseEntity<IGDBGameDTO[]> response = restTemplate.postForEntity(url, entity, IGDBGameDTO[].class);

        if (response.getBody() != null) {
            IGDBGameDTO[] gameDTOArray = response.getBody();
            List<IGDBGameDTO> gameDTOList = Arrays.asList(gameDTOArray);
            return gameDTOList;
        } else {
            return Collections.emptyList();
        }
    }
}
