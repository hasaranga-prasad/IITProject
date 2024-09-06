package com.IIT.personal_finance_tracker.controller.controller;
import com.IIT.personal_finance_tracker.dto.category.CategoryDTO;
import com.IIT.personal_finance_tracker.response.category.CategoryResponseDTO;
import com.IIT.personal_finance_tracker.service.category.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user/category")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping("/create")
    public ResponseEntity<CategoryResponseDTO> createCategory(@RequestBody @Validated CategoryDTO categoryDTO) {
        CategoryResponseDTO response = categoryService.createCategory(categoryDTO);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponseDTO> getCategoryById(@PathVariable Long id) {
        CategoryResponseDTO response = categoryService.getCategoryById(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<CategoryResponseDTO> updateCategory(@PathVariable Long id, @RequestBody CategoryDTO categoryDTO) {
        CategoryResponseDTO response = categoryService.updateCategory(id, categoryDTO);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<CategoryResponseDTO> deleteCategory(@PathVariable Long id) {
        CategoryResponseDTO response = categoryService.deleteCategory(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/all")
    public ResponseEntity<CategoryResponseDTO> getAllCategories() {
        CategoryResponseDTO response = categoryService.getAllCategories();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}

