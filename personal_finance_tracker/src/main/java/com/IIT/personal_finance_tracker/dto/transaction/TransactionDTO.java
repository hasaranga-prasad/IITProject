package com.IIT.personal_finance_tracker.dto.transaction;
import com.IIT.personal_finance_tracker.utill.enums.TransactionCategoryType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransactionDTO {

    private Long id;

    @NotNull(message = "Amount is required.")
    @Positive(message = "Amount must be positive.")
    private BigDecimal amount;
    @Size(min = 1, message = "Description must not be empty.")
    private String description;
    @NotNull(message = "TransactionController date is required.")
    private LocalDateTime transactionDate;
    @NotNull(message = "TransactionController type is required.")
    private TransactionCategoryType type;
    @NotNull(message = "Category ID is required.")
    private Long categoryId;
}

