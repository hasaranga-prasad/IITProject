package com.IIT.personal_finance_tracker.controller.transaction;
import com.IIT.personal_finance_tracker.dto.transaction.TransactionDTO;
import com.IIT.personal_finance_tracker.response.transaction.TransactionResponseDTO;
import com.IIT.personal_finance_tracker.service.transaction.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/user/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @PostMapping("/create")
    public ResponseEntity<TransactionResponseDTO> createTransaction(@RequestBody @Validated TransactionDTO transactionDTO) {
        TransactionResponseDTO response = transactionService.createTransaction(transactionDTO);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }


    @GetMapping("/{id}")
    public ResponseEntity<TransactionResponseDTO> getTransactionById(@PathVariable Long id) {
        TransactionResponseDTO response = transactionService.getTransactionById(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }


    @PutMapping("/update/{id}")
    public ResponseEntity<TransactionResponseDTO> updateTransaction(@PathVariable Long id, @RequestBody @Validated TransactionDTO transactionDTO) {
        TransactionResponseDTO response = transactionService.updateTransaction(id, transactionDTO);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<TransactionResponseDTO> deleteTransaction(@PathVariable Long id) {
        TransactionResponseDTO response = transactionService.deleteTransaction(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/all")
    public ResponseEntity<TransactionResponseDTO> getAllTransactions() {
        TransactionResponseDTO response = transactionService.getAllTransactions();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

}
