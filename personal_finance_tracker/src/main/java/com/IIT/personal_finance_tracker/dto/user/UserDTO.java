package com.IIT.personal_finance_tracker.dto.user;



import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {

    private Long id;
    private String username;
    private String confirmPassword;
    private String password;
    private String email;
}
