package com.example.backend.service;

import com.example.backend.dto.IGDB.IGDBGameDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
public class IGDBService {

    @Value("${access.token}")
    private String accessToken;
    @Value("${client.id}")
    private String clientId;

    private final RestTemplate restTemplate;

    public IGDBService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<IGDBGameDTO> findGamesByName(String query) {
        String url = "https://api.igdb.com/v4/games";
        HttpHeaders headers = createHeaders();

        String body = "search \"" + query + "\"; fields id,name,rating,summary,cover.url,first_release_date,artworks;";

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

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);
        headers.add("Client-ID", clientId);
        return headers;
    }
}
