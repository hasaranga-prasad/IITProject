package com.IIT.personal_finance_tracker.repository.transaction;


import com.IIT.personal_finance_tracker.entity.transaction.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;

public interface TransactionRepo extends JpaRepository<Transaction, Long> {
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.type = 'INCOME'")
    BigDecimal getTotalIncome();
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.type = 'EXPENSE'")
    BigDecimal getTotalExpense();
}
