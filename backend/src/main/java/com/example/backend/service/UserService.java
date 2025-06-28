package com.example.backend.service;

import com.example.backend.dto.request.UserRequestDTO;
import com.example.backend.dto.response.UserResponseDTO;
import com.example.backend.mapper.UserMapper;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponseDTO createUser(UserRequestDTO dto) {
        String hashedPassword = passwordEncoder.encode(dto.getPassword());
        User user = UserMapper.fromRequest(dto, hashedPassword);
        User saved = userRepository.save(user);
        return UserMapper.toDto(saved);
    }

    public Optional<UserResponseDTO> getUserById(Long id) {
        return userRepository.findById(id)
                .map(UserMapper::toDto);
    }

    public Optional<UserResponseDTO> getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .map(UserMapper::toDto);
    }

    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserMapper::toDto)
                .toList();
    }

    public Optional<UserResponseDTO> updateUser(Long id, UserRequestDTO dto) {
        Optional<User> existingUserOpt = userRepository.findById(id);
        if (existingUserOpt.isPresent()) {
            User existingUser = existingUserOpt.get();

            existingUser.setUsername(dto.getUsername());
            existingUser.setEmail(dto.getEmail());

            // If the password is provided, hash and update it
            if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
                String hashedPassword = passwordEncoder.encode(dto.getPassword());
                existingUser.setPasswordHash(hashedPassword);
            }

            User updatedUser = userRepository.save(existingUser);
            return Optional.of(UserMapper.toDto(updatedUser));
        }

        return Optional.empty();  // If user does not exist, return empty
    }

    public boolean deleteUser(Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            userRepository.delete(userOpt.get());
            return true; // Deletion successful
        }
        return false;
    }

    public Optional<User> authenticate(String username, String rawPassword) {
        return userRepository.findByUsername(username)
                .filter(user -> passwordEncoder.matches(rawPassword, user.getPasswordHash()));
    }

}
