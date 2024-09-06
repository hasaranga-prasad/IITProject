package com.IIT.personal_finance_tracker.service.category;
import com.IIT.personal_finance_tracker.dto.category.CategoryDTO;
import com.IIT.personal_finance_tracker.entity.category.Category;
import com.IIT.personal_finance_tracker.repository.category.CategoryRepo;
import com.IIT.personal_finance_tracker.response.category.CategoryResponseDTO;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryServiceImpl implements CategoryService {
    private static final Logger logger = LoggerFactory.getLogger(CategoryServiceImpl.class);

    @Autowired
    private CategoryRepo categoryRepo;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public CategoryResponseDTO createCategory(CategoryDTO categoryDTO) {
        logger.info("Creating new category: {}", categoryDTO.getName());
        CategoryResponseDTO response = new CategoryResponseDTO();

        try {

            if (categoryDTO.getName() == null || categoryDTO.getName().trim().isEmpty()) {
                logger.warn("Category name is missing or empty.");
                response.setStatusCode(400);
                response.setError("Invalid Input");
                response.setMessage("Category name is required.");
                return response;
            }


            if (categoryDTO.getType() == null) {
                logger.warn("Category type is missing.");
                response.setStatusCode(400);
                response.setError("Invalid Input");
                response.setMessage("Category type is required.");
                return response;
            }




            Optional<Category> existingCategory = categoryRepo.findByName(categoryDTO.getName());
            if (existingCategory.isPresent()) {
                logger.warn("Category with name '{}' already exists.", categoryDTO.getName());
                response.setStatusCode(400);
                response.setError("Duplicate Category");
                response.setMessage("A category with this name already exists.");
                return response;
            }


            Category category = modelMapper.map(categoryDTO, Category.class);
            Category savedCategory = categoryRepo.save(category);


            response.setStatusCode(201);
            response.setMessage("Category created successfully");
            response.setCategory(savedCategory);

            logger.info("Category created successfully with ID: {}", savedCategory.getId());
        } catch (DataIntegrityViolationException e) {
            logger.error("Database error occurred while creating category: {}", e.getMessage());
            response.setStatusCode(500);
            response.setError("Database error");
            response.setMessage("A database error occurred while creating the category");
        } catch (Exception e) {
            logger.error("Unexpected error occurred while creating category: {}", e.getMessage());
            response.setStatusCode(500);
            response.setError("Server error");
            response.setMessage("An unexpected error occurred while creating the category");
        }

        return response;
    }


    @Override
    public CategoryResponseDTO getCategoryById(Long id) {
        CategoryResponseDTO response = new CategoryResponseDTO();
        try {
            Optional<Category> categoryOptional = categoryRepo.findById(id);
            if (categoryOptional.isPresent()) {
                response.setStatusCode(200);
                response.setMessage("Category fetched successfully");
                response.setCategory(categoryOptional.get());
            } else {
                response.setStatusCode(404);
                response.setError("Not Found");
                response.setMessage("Category with ID " + id + " not found.");
            }
        } catch (Exception e) {
            logger.error("Unexpected error occurred while fetching category by ID: {}", e.getMessage());
            response.setStatusCode(500);
            response.setError("Server error");
            response.setMessage("An unexpected error occurred while fetching the category");
        }
        return response;
    }

    @Override
    public CategoryResponseDTO updateCategory(Long id, CategoryDTO categoryDTO) {
        CategoryResponseDTO response = new CategoryResponseDTO();
        try {
            Optional<Category> existingCategoryOptional = categoryRepo.findById(id);
            if (existingCategoryOptional.isPresent()) {
                Category existingCategory = existingCategoryOptional.get();

                if (categoryDTO.getType() != null) {
                    existingCategory.setType(categoryDTO.getType());
                }
                if (categoryDTO.getName() != null && !categoryDTO.getName().trim().isEmpty()) {
                    existingCategory.setName(categoryDTO.getName());
                }


                Category updatedCategory = categoryRepo.save(existingCategory);

                response.setStatusCode(200);
                response.setMessage("Category updated successfully");
                response.setCategory(updatedCategory);
            } else {
                response.setStatusCode(404);
                response.setError("Not Found");
                response.setMessage("Category with ID " + id + " not found.");
            }
        } catch (DataIntegrityViolationException e) {
            logger.error("Database error occurred while updating category: {}", e.getMessage());
            response.setStatusCode(500);
            response.setError("Database error");
            response.setMessage("A database error occurred while updating the category");
        } catch (Exception e) {
            logger.error("Unexpected error occurred while updating category: {}", e.getMessage());
            response.setStatusCode(500);
            response.setError("Server error");
            response.setMessage("An unexpected error occurred while updating the category");
        }
        return response;
    }

    @Override
    public CategoryResponseDTO deleteCategory(Long id) {
        CategoryResponseDTO response = new CategoryResponseDTO();
        try {
            if (categoryRepo.existsById(id)) {
                categoryRepo.deleteById(id);
                response.setStatusCode(200);
                response.setMessage("Category deleted successfully");
            } else {
                response.setStatusCode(404);
                response.setError("Not Found");
                response.setMessage("Category with ID " + id + " not found.");
            }
        } catch (Exception e) {
            logger.error("Unexpected error occurred while deleting category: {}", e.getMessage());
            response.setStatusCode(500);
            response.setError("Server error");
            response.setMessage("An unexpected error occurred while deleting the category");
        }
        return response;
    }

    @Override
    public CategoryResponseDTO getAllCategories() {
        CategoryResponseDTO response = new CategoryResponseDTO();
        try {
            List<Category> categories = categoryRepo.findAll();
            if (!categories.isEmpty()) {
                response.setStatusCode(200);
                response.setMessage("Categories fetched successfully");
                response.setCategoryList(categories);
            } else {
                response.setStatusCode(404);
                response.setError("Not Found");
                response.setMessage("No categories found.");
            }
        } catch (Exception e) {
            logger.error("Unexpected error occurred while fetching all categories: {}", e.getMessage());
            response.setStatusCode(500);
            response.setError("Server error");
            response.setMessage("An unexpected error occurred while fetching the categories");
        }
        return response;
    }
}
