package com.IIT.personal_finance_tracker.controller.user;

import com.IIT.personal_finance_tracker.dto.user.UserDTO;
import com.IIT.personal_finance_tracker.response.user.UserResponseDTO;
import com.IIT.personal_finance_tracker.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/auth/refresh")
    public ResponseEntity<UserResponseDTO> refreshToken(@RequestBody UserResponseDTO userResponseDTO) {
        return ResponseEntity.ok(userService.refreshToken(userResponseDTO));
    }

    @PostMapping("/auth/register")
    public ResponseEntity<UserResponseDTO> register(@RequestBody UserDTO userDTO) {
        return ResponseEntity.ok(userService.createUser(userDTO));

    }
    @PostMapping("/auth/login")
    public ResponseEntity<UserResponseDTO> login(@RequestBody UserDTO userDTO){
        return ResponseEntity.ok(userService.login(userDTO));
    }
    @GetMapping("/auth/get-profile")
    public ResponseEntity<UserResponseDTO> getMyProfile(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();
        UserResponseDTO response = userService.getMyInfo(userId);
        return  ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
