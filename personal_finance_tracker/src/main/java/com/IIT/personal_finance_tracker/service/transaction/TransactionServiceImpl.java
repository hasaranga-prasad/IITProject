package com.IIT.personal_finance_tracker.service.transaction;
import com.IIT.personal_finance_tracker.dto.transaction.TransactionDTO;
import com.IIT.personal_finance_tracker.entity.category.Category;
import com.IIT.personal_finance_tracker.entity.transaction.Transaction;
import com.IIT.personal_finance_tracker.repository.category.CategoryRepo;
import com.IIT.personal_finance_tracker.repository.transaction.TransactionRepo;
import com.IIT.personal_finance_tracker.response.transaction.TransactionResponseDTO;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service

public class TransactionServiceImpl implements TransactionService {
    @Autowired
    private TransactionRepo transactionRepo;
    @Autowired
    private  CategoryRepo categoryRepo;
    @Autowired
    private  ModelMapper modelMapper;
    private static final Logger logger = LoggerFactory.getLogger(TransactionServiceImpl.class);
    @Override
    public TransactionResponseDTO createTransaction(TransactionDTO transactionDTO) {
        logger.info("Creating new transaction: {}", transactionDTO.getDescription());
        TransactionResponseDTO response = new TransactionResponseDTO();

        try {

            if (transactionDTO.getAmount() == null || transactionDTO.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
                logger.warn("Invalid transaction amount: {}", transactionDTO.getAmount());
                response.setStatusCode(400);
                response.setError("Invalid Input");
                response.setMessage("TransactionController amount must be positive.");
                return response;
            }


            if (transactionDTO.getDescription() == null || transactionDTO.getDescription().trim().isEmpty()) {
                logger.warn("TransactionController description is missing or empty.");
                response.setStatusCode(400);
                response.setError("Invalid Input");
                response.setMessage("TransactionController description is required.");
                return response;
            }


            Category category = categoryRepo.findById(transactionDTO.getCategoryId())
                    .orElse(null);
            if (category == null) {
                logger.warn("Category not found with ID: {}", transactionDTO.getCategoryId());
                response.setStatusCode(404);
                response.setError("Category Not Found");
                response.setMessage("The specified category does not exist.");
                return response;
            }


            Transaction transaction = modelMapper.map(transactionDTO, Transaction.class);
            transaction.setCategory(category);
            Transaction savedTransaction = transactionRepo.save(transaction);


            response.setStatusCode(201);
            response.setMessage("TransactionController created successfully");
            response.setTransaction(savedTransaction);

            logger.info("TransactionController created successfully with ID: {}", savedTransaction.getId());
        } catch (DataIntegrityViolationException e) {
            logger.error("Database error occurred while creating transaction: {}", e.getMessage());
            response.setStatusCode(500);
            response.setError("Database error");
            response.setMessage("A database error occurred while creating the transaction.");
        } catch (Exception e) {
            logger.error("Unexpected error occurred while creating transaction: {}", e.getMessage());
            response.setStatusCode(500);
            response.setError("Server error");
            response.setMessage("An unexpected error occurred while creating the transaction.");
        }

        return response;
    }

    @Override
    public TransactionResponseDTO getTransactionById(Long id) {
        logger.info("Fetching transaction with ID: {}", id);
        TransactionResponseDTO response = new TransactionResponseDTO();

        Optional<Transaction> transactionOptional = transactionRepo.findById(id);
        if (transactionOptional.isPresent()) {
            response.setStatusCode(200);  // OK
            response.setTransaction(transactionOptional.get());
            logger.info("Transaction found with ID: {}", id);
        } else {
            logger.warn("Transaction not found with ID: {}", id);
            response.setStatusCode(404);  // Not Found
            response.setError("Transaction Not Found");
            response.setMessage("The specified transaction does not exist.");
        }

        return response;
    }

    @Override
    public TransactionResponseDTO updateTransaction(Long id, TransactionDTO transactionDTO) {
        logger.info("Updating transaction with ID: {}", id);
        TransactionResponseDTO response = new TransactionResponseDTO();

        try {
            Optional<Transaction> transactionOptional = transactionRepo.findById(id);
            if (transactionOptional.isPresent()) {
                Transaction transaction = transactionOptional.get();

                // Update fields with new data
                if (transactionDTO.getAmount() != null && transactionDTO.getAmount().compareTo(BigDecimal.ZERO) > 0) {
                    transaction.setAmount(transactionDTO.getAmount());
                }

                if (transactionDTO.getDescription() != null && !transactionDTO.getDescription().trim().isEmpty()) {
                    transaction.setDescription(transactionDTO.getDescription());
                }

                // Validate and update the category if changed
                if (transactionDTO.getCategoryId() != null && !transactionDTO.getCategoryId().equals(transaction.getCategory().getId())) {
                    Category category = categoryRepo.findById(transactionDTO.getCategoryId())
                            .orElse(null);
                    if (category == null) {
                        logger.warn("Category not found with ID: {}", transactionDTO.getCategoryId());
                        response.setStatusCode(404);
                        response.setError("Category Not Found");
                        response.setMessage("The specified category does not exist.");
                        return response;
                    }
                    transaction.setCategory(category);
                }

                // Save updated transaction
                Transaction updatedTransaction = transactionRepo.save(transaction);

                // Prepare success response
                response.setStatusCode(200);  // OK
                response.setMessage("Transaction updated successfully");
                response.setTransaction(updatedTransaction);

                logger.info("Transaction updated successfully with ID: {}", updatedTransaction.getId());
            } else {
                logger.warn("Transaction not found with ID: {}", id);
                response.setStatusCode(404);  // Not Found
                response.setError("Transaction Not Found");
                response.setMessage("The specified transaction does not exist.");
            }
        } catch (DataIntegrityViolationException e) {
            logger.error("Database error occurred while updating transaction: {}", e.getMessage());
            response.setStatusCode(500);
            response.setError("Database error");
            response.setMessage("A database error occurred while updating the transaction.");
        } catch (Exception e) {
            logger.error("Unexpected error occurred while updating transaction: {}", e.getMessage());
            response.setStatusCode(500);
            response.setError("Server error");
            response.setMessage("An unexpected error occurred while updating the transaction.");
        }

        return response;
    }

    @Override
    public TransactionResponseDTO deleteTransaction(Long id) {
        logger.info("Deleting transaction with ID: {}", id);
        TransactionResponseDTO response = new TransactionResponseDTO();

        try {
            Optional<Transaction> transactionOptional = transactionRepo.findById(id);
            if (transactionOptional.isPresent()) {
                transactionRepo.deleteById(id);

                // Prepare success response
                response.setStatusCode(200);  // OK
                response.setMessage("Transaction deleted successfully");

                logger.info("Transaction deleted successfully with ID: {}", id);
            } else {
                logger.warn("Transaction not found with ID: {}", id);
                response.setStatusCode(404);  // Not Found
                response.setError("Transaction Not Found");
                response.setMessage("The specified transaction does not exist.");
            }
        } catch (DataIntegrityViolationException e) {
            logger.error("Database error occurred while deleting transaction: {}", e.getMessage());
            response.setStatusCode(500);
            response.setError("Database error");
            response.setMessage("A database error occurred while deleting the transaction.");
        } catch (Exception e) {
            logger.error("Unexpected error occurred while deleting transaction: {}", e.getMessage());
            response.setStatusCode(500);
            response.setError("Server error");
            response.setMessage("An unexpected error occurred while deleting the transaction.");
        }

        return response;
    }

    @Override
    public TransactionResponseDTO getAllTransactions() {
        logger.info("Fetching all transactions");
        TransactionResponseDTO response = new TransactionResponseDTO();


        try {
            List<Transaction> transactions = transactionRepo.findAll();
            BigDecimal totalIncome = transactionRepo.getTotalIncome();
            BigDecimal totalExpense = transactionRepo.getTotalExpense();
            if (!transactions.isEmpty()) {
                response.setStatusCode(200);
                response.setTransactionList(transactions);
                response.setAmountofIncome(totalIncome);
                response.setAmountofExpense(totalExpense);
                logger.info("Found {} transactions", transactions.size());
            } else {
                logger.warn("No transactions found");
                response.setStatusCode(404);
                response.setError("No Transactions Found");
                response.setMessage("There are no transactions available.");
                response.setAmountofIncome(BigDecimal.ZERO);
                response.setAmountofExpense(BigDecimal.ZERO);
            }
        } catch (Exception e) {
            logger.error("Unexpected error occurred while fetching transactions: {}", e.getMessage());
            response.setStatusCode(500);
            response.setError("Server error");
            response.setMessage("An unexpected error occurred while fetching the transactions.");
            response.setAmountofIncome(BigDecimal.ZERO);
            response.setAmountofExpense(BigDecimal.ZERO);
        }

        return response;
    }

}
