package com.velvetcrown.hotel.service;

import com.velvetcrown.hotel.dto.AuthRequest;
import com.velvetcrown.hotel.dto.AuthResponse;
import com.velvetcrown.hotel.dto.RegisterRequest;
import com.velvetcrown.hotel.entity.User;
import com.velvetcrown.hotel.exception.BadRequestException;
import com.velvetcrown.hotel.exception.ResourceNotFoundException;
import com.velvetcrown.hotel.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("An account with email " + request.getEmail() + " already exists");
        }

        String role = (request.getRole() != null && !request.getRole().isBlank()) 
                ? request.getRole() 
                : "ROLE_GUEST";

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail().toLowerCase().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole(role);

        User savedUser = userRepository.save(user);

        // Generate demo session token
        String token = "vc-demo-token-" + UUID.randomUUID().toString();
        return new AuthResponse(token, savedUser.getId(), savedUser.getName(), 
                savedUser.getEmail(), savedUser.getPhone(), savedUser.getRole());
    }

    public AuthResponse login(AuthRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }

        String token = "vc-demo-token-" + UUID.randomUUID().toString();
        return new AuthResponse(token, user.getId(), user.getName(), 
                user.getEmail(), user.getPhone(), user.getRole());
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
