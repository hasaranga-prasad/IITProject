package com.IIT.personal_finance_tracker.entity.transaction;


import com.IIT.personal_finance_tracker.entity.category.Category;
import com.IIT.personal_finance_tracker.utill.enums.TransactionCategoryType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private BigDecimal amount;

    private String description;

    @Column(nullable = false)
    private LocalDate transactionDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionCategoryType type;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;


}

