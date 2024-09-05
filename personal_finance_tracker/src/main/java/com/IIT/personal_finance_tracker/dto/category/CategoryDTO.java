package com.IIT.personal_finance_tracker.dto.category;

import com.IIT.personal_finance_tracker.utill.enums.TransactionCategoryType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryDTO {

    private Long id;
    private String name;
    private TransactionCategoryType type;

}

