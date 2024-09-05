package com.IIT.personal_finance_tracker.response.user;

import com.IIT.personal_finance_tracker.entity.user.User;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Data
@Component
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserResponseDTO {
    private int statusCode;
    private String error;
    private String message;
    private String role;
    private String token;
    private String refreshToken;
    private String expirationTime;
    private User user;
    private List<User> userList;
}
