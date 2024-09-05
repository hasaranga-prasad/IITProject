package com.IIT.personal_finance_tracker.service.user;

import com.IIT.personal_finance_tracker.dto.user.UserDTO;
import com.IIT.personal_finance_tracker.response.user.UserResponseDTO;

public interface UserService {
    UserResponseDTO createUser(UserDTO userDTO);
    UserResponseDTO refreshToken(UserResponseDTO userResponseDTO);
    UserResponseDTO login(UserDTO userDTO);
}
