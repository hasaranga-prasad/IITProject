package com.IIT.personal_finance_tracker.response.transaction;

import com.IIT.personal_finance_tracker.entity.transaction.Transaction;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Data
@Component
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class TransactionResponseDTO {
    private int statusCode;
    private String error;
    private String message;
    private BigDecimal amountofIncome;
    private BigDecimal amountofExpense;
    private Transaction transaction;
    private List<Transaction> transactionList;
}
