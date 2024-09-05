package com.IIT.personal_finance_tracker.repository.category;

import com.IIT.personal_finance_tracker.entity.category.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoryRepo extends JpaRepository<Category, Long> {
    Optional<Category> findByName(String name);

}
