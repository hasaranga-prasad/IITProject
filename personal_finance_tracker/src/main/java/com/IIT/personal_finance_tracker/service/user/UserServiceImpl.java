package com.IIT.personal_finance_tracker.service.user;

import com.IIT.personal_finance_tracker.dto.user.UserDTO;
import com.IIT.personal_finance_tracker.entity.user.User;
import com.IIT.personal_finance_tracker.repository.user.UserRepo;
import com.IIT.personal_finance_tracker.response.user.UserResponseDTO;
import com.IIT.personal_finance_tracker.utill.enums.jwt.JWTUtils;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);
    @Autowired
    private JWTUtils jwtUtils;
    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private AuthenticationManager authenticationManager;

    @Override
    @Transactional
    public UserResponseDTO createUser(UserDTO userDTO) {
        logger.info("Starting user creation process for username: {}", userDTO.getUsername());

        try {

            if (!userDTO.getPassword().equals(userDTO.getConfirmPassword())) {
                logger.warn("Password mismatch for username: {}", userDTO.getUsername());
                return new UserResponseDTO(400, "Password mismatch", "The passwords do not match", null, null, null, null, null, null);
            }


            if (userRepo.existsByUsername(userDTO.getUsername())) {
                logger.warn("Username already exists: {}", userDTO.getUsername());
                return new UserResponseDTO(400, "Username already exists", "The username is already taken", null, null, null, null, null, null);
            }
            if (userRepo.existsByEmail(userDTO.getEmail())) {
                logger.warn("Email already exists: {}", userDTO.getEmail());
                return new UserResponseDTO(400, "Email already exists", "The email is already registered", null, null, null, null, null, null);
            }


            User user = modelMapper.map(userDTO, User.class);
            user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
            user.setRole("USER");

            user = userRepo.save(user);
            logger.info("User created successfully with ID: {}", user.getId());


            UserResponseDTO response = new UserResponseDTO();
            response.setStatusCode(201);  // HTTP Created
            response.setMessage("User created successfully");
            response.setUser(user);

            return response;

        } catch (DataIntegrityViolationException e) {
            logger.error("Database error occurred while creating user: {}", e.getMessage());
            return new UserResponseDTO(500, "Database error", "A database error occurred", null, null, null, null, null, null);
        } catch (Exception e) {
            logger.error("Unexpected error occurred while creating user: {}", e.getMessage());
            return new UserResponseDTO(500, "Server error", "An unexpected error occurred", null, null, null, null, null, null);
        }
    }

    @Override
    @Transactional
    public UserResponseDTO refreshToken(UserResponseDTO userResponseDTO) {
        UserResponseDTO response = new UserResponseDTO();
        try {
            String token = userResponseDTO.getToken();


            if (token == null || token.isEmpty()) {
                logger.warn("Token is missing or empty.");
                response.setStatusCode(400);
                response.setMessage("Token is required");
                return response;
            }

            String userName = jwtUtils.extractUsername(token);
            if (userName == null) {
                logger.warn("Token does not contain a valid username.");
                response.setStatusCode(400);
                response.setMessage("Invalid token");
                return response;
            }

            User user = userRepo.findByUsername(userName).orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + userName));

            if (!jwtUtils.isTokenValid(token, user)) {
                logger.warn("Token is invalid or expired for username: {}", userName);
                response.setStatusCode(401);
                response.setMessage("Token is invalid or expired");
                return response;
            }


            String newJwt = jwtUtils.generateToken(user);
            response.setStatusCode(200);
            response.setToken(newJwt);
            response.setRefreshToken(token);
            response.setExpirationTime("24Hr");
            response.setMessage("Successfully refreshed token");

            logger.info("Token successfully refreshed for username: {}", userName);

        } catch (UsernameNotFoundException e) {
            logger.warn("User not found for token refresh: {}", e.getMessage());
            response.setStatusCode(404);
            response.setMessage("User not found");
        } catch (Exception e) {
            logger.error("Error occurred during token refresh: {}", e.getMessage());
            response.setStatusCode(500);
            response.setMessage("An unexpected error occurred");
        }
        return response;
    }

    @Override
    @Transactional
    public UserResponseDTO login(UserDTO userDTO) {
        UserResponseDTO response = new UserResponseDTO();


        if (userDTO.getUsername() == null || userDTO.getUsername().trim().isEmpty() ||
                userDTO.getPassword() == null || userDTO.getPassword().trim().isEmpty()) {
            logger.warn("Invalid input: Username or password is missing or empty.");
            response.setStatusCode(400);
            response.setMessage("Username and password are required.");
            return response;
        }


        boolean userExists = userRepo.existsByUsername(userDTO.getUsername());
        if (!userExists) {
            logger.warn("Login attempt failed for username {}: User not found", userDTO.getUsername());
            response.setStatusCode(404);
            response.setMessage("Username not found.");
            return response;
        }


        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(userDTO.getUsername(), userDTO.getPassword()));
        } catch (BadCredentialsException e) {
            logger.warn("Login attempt failed for username {}: Incorrect credentials", userDTO.getUsername());
            response.setStatusCode(401);
            response.setMessage("Incorrect Password.");
            return response;
        } catch (Exception e) {
            logger.error("Unexpected error during login for username {}: {}", userDTO.getUsername(), e.getMessage());
            response.setStatusCode(500);
            response.setMessage("An unexpected error occurred.");
            return response;
        }


        User user = userRepo.findByUsername(userDTO.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + userDTO.getUsername()));

        String jwt = jwtUtils.generateToken(user);
        String refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), user);


        response.setStatusCode(200);
        response.setToken(jwt);
        response.setRole(user.getRole());
        response.setRefreshToken(refreshToken);
        response.setExpirationTime("24Hrs");
        response.setMessage("Successfully logged in.");

        logger.info("User {} logged in successfully.", userDTO.getUsername());

        return response;
    }



    @Override
    public UserResponseDTO getMyInfo(String userId) {
        UserResponseDTO userResponseDTO = new UserResponseDTO();
        try {
            Optional<User> userOptional = userRepo.findByUsername(userId);
            if (userOptional.isPresent()) {
                userResponseDTO.setUser(userOptional.get());
                userResponseDTO.setStatusCode(200);
                userResponseDTO.setMessage("Successful");
            } else {
                userResponseDTO.setStatusCode(404);
                userResponseDTO.setMessage("User not found for update");
            }
        } catch (Exception e) {
            userResponseDTO.setStatusCode(500);
            userResponseDTO.setMessage("Error occurred while getting user info: " + e.getMessage());
        }
        return userResponseDTO;

    }

}
