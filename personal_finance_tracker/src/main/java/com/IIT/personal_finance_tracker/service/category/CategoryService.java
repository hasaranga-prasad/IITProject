package com.IIT.personal_finance_tracker.service.category;

import com.IIT.personal_finance_tracker.dto.category.CategoryDTO;
import com.IIT.personal_finance_tracker.response.category.CategoryResponseDTO;

public interface CategoryService {
    CategoryResponseDTO createCategory(CategoryDTO categoryDTO);
    CategoryResponseDTO getCategoryById(Long id);
    CategoryResponseDTO updateCategory(Long id, CategoryDTO categoryDTO);
    CategoryResponseDTO deleteCategory(Long id);
    CategoryResponseDTO getAllCategories();
}
