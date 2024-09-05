package com.IIT.personal_finance_tracker.response.category;

import com.IIT.personal_finance_tracker.entity.category.Category;
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
public class CategoryResponseDTO {
    private int statusCode;
    private String error;
    private String message;
    private Category category;
    private List<Category> categoryList;
}
