package com.example.backend.service;

import com.example.backend.dto.UserDTO;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.modelMapper = new ModelMapper();
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(user -> modelMapper.map(user, UserDTO.class)) // Use ModelMapper to map User to UserDTO
                .collect(Collectors.toList());
    }

    public UserDTO createUser(UserDTO userDTO) {
        userDTO.setCreatedAt(null);
        User user = modelMapper.map(userDTO, User.class);
        userRepository.save(user);
        return modelMapper.map(user, UserDTO.class);
    }
}

