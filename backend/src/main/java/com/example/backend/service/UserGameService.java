package com.example.backend.service;

import com.example.backend.dto.UserDTO;
import com.example.backend.dto.UserGameDTO;
import com.example.backend.model.User;
import com.example.backend.model.UserGame;
import com.example.backend.repository.UserGameRepository;
import com.example.backend.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserGameService {

    private final UserGameRepository userGameRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    public UserGameService(UserGameRepository userGameRepository, UserRepository userRepository) {
        this.userGameRepository = userGameRepository;
        this.userRepository = userRepository;
        this.modelMapper = new ModelMapper();
    }

    public List<UserGameDTO> getAllUserGames() {
        return userGameRepository.findAll().
                stream().
                map(userGame -> modelMapper.map(userGame, UserGameDTO.class)).collect(Collectors.toList());
    }

    @Transactional
    public UserGameDTO createUserGame(UserGameDTO userGameDTO) {
        UserGame userGame = modelMapper.map(userGameDTO, UserGame.class);

        userGame.setUser(userRepository.findById(userGameDTO.getIdUser())
                .orElseThrow(() -> new RuntimeException("User not found")));

        userGameRepository.save(userGame);
        return modelMapper.map(userGame, UserGameDTO.class);
    }

    public UserGameDTO updateUserGame(Integer id, UserGameDTO userGameDTO) {
        UserGame userGame = userGameRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("UserGame not found"));
        modelMapper.map(userGameDTO, userGame);
        return modelMapper.map(userGameRepository.save(userGame), UserGameDTO.class);
    }

    public UserGameDTO deleteUserGame(Integer id) {
        UserGame userGame = userGameRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("UserGame not found"));
        userGameRepository.delete(userGame);
        return modelMapper.map(userGame, UserGameDTO.class);
    }
}
