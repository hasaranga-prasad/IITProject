package com.IIT.personal_finance_tracker.dto.category;

import com.IIT.personal_finance_tracker.utill.enums.TransactionCategoryType;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryDTO {

    private Long id;
    @Size(min = 1, message = "name must not be empty.")
    private String name;
    private TransactionCategoryType type;

}

