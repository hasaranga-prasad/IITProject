package com.IIT.personal_finance_tracker.service.transaction;

import com.IIT.personal_finance_tracker.dto.transaction.TransactionDTO;
import com.IIT.personal_finance_tracker.response.transaction.TransactionResponseDTO;

import java.math.BigDecimal;
import java.util.Map;

public interface TransactionService {


    TransactionResponseDTO createTransaction(TransactionDTO transactionDTO);


    TransactionResponseDTO getTransactionById(Long id);


    TransactionResponseDTO updateTransaction(Long id, TransactionDTO transactionDTO);


    TransactionResponseDTO deleteTransaction(Long id);


    TransactionResponseDTO getAllTransactions();
}
