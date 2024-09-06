import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../users.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  catagories: any[] = [];
  amountOfIncome: number = 0;
  amountOfExpense: number = 0;
  errorMessage: string = '';
  dialogVisible: boolean = false;
  catagories1: any;

  filteredCatagories: any[] = [];
  createDialogVisible: boolean = false;
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  newcatagories: any = {
    name: '',
    type: '',
  };

  constructor(
    private readonly userService: UsersService,
    private readonly router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  async loadData() {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await this.userService.getAllCategories(token);
        if (response && response.statusCode === 200) {
          this.catagories = response.categoryList;
          this.filteredCatagories = this.catagories;
          this.amountOfIncome = response.amountofIncome;
          this.amountOfExpense = response.amountofExpense;
          this.totalItems = this.filteredCatagories.length;
          this.toastr.success('Categories loaded successfully.');
        } else {
          this.toastr.warning('No categories found.');
        }
      } else {
        this.toastr.error('Token is missing.');
      }
    } catch (error: any) {
      this.toastr.error(error.message || 'An error occurred while fetching categories.');
    }
  }

  showCreateDialog() {
    this.createDialogVisible = true;
  }

  onCloseCreateDialog() {
    this.createDialogVisible = false;
  }

  async onCreate() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.toastr.error('Token is missing.');
      return;
    }
    try {
      await this.userService.categoryCreate(this.newcatagories, token);
      this.createDialogVisible = false;
      this.toastr.success('Category created successfully.');
      this.loadData();
    } catch (error: any) {
      this.toastr.error(error.message || 'An error occurred while creating the category.');
    }
  }

  onReset() {
    this.searchTerm = '';
    this.filteredCatagories = this.catagories;
    this.totalItems = this.catagories.length;
    this.currentPage = 1;
    this.toastr.info('Filters reset.');
  }

  searchCatagories() {
    let filtered = this.catagories;
    if (this.searchTerm) {
      filtered = filtered.filter(catagories =>
        catagories.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        catagories.type.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.filteredCatagories = filtered;
    this.totalItems = this.filteredCatagories.length;
    this.currentPage = 1;
  }

  get paginatedCatagories() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredCatagories.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  onItemsPerPageChange(items: number) {
    this.itemsPerPage = items;
    this.currentPage = 1;
    this.loadData();
  }

  onEdit(catagories: any) {
    this.catagories1 = { ...catagories };
    this.dialogVisible = true;
  }

  async onDelete(Id: string) {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          await this.userService.deleteCategory(Id, token);
          this.toastr.success('Category deleted successfully.');
          this.loadData();
        } else {
          this.toastr.error('Token is missing.');
        }
      } catch (error: any) {
        this.toastr.error(error.message || 'An error occurred while deleting the category.');
      }
    }
  }

  onView(catagoryId: string) {
    localStorage.setItem('selectedCategoryId', catagoryId);
    this.showDialog();
  }

  showDialog() {
    this.dialogVisible = true;
    this.getcatagoryById();
  }

  async getcatagoryById() {
    const Id = localStorage.getItem('selectedCategoryId');
    const token = localStorage.getItem('token');
    if (!Id || !token) {
      this.toastr.error('Category ID or Token is missing.');
      return;
    }

    try {
      const catagoryDataResponse = await this.userService.getCategoryById(Id, token);
      if (catagoryDataResponse && catagoryDataResponse.statusCode === 200) {
        this.catagories1 = catagoryDataResponse.category;
        this.toastr.success('Category details fetched successfully.');
      } else {
        this.toastr.error('Failed to fetch category details.');
      }
    } catch (error: any) {
      this.toastr.error(error.message || 'An error occurred while fetching category details.');
    }
  }

  async onSave() {
    const token = localStorage.getItem('token');
    if (!this.catagories1 || !token) {
      this.toastr.error('Category data or Token is missing.');
      return;
    }

    const updatePayload = {
      name: this.catagories1.name,
      type: this.catagories1.type,
    };

    try {
      await this.userService.updateCategory(this.catagories1.id, updatePayload, token);
      this.dialogVisible = false;
      this.toastr.success('Category updated successfully.');
      this.loadData();
    } catch (error: any) {
      this.toastr.error(error.message || 'An error occurred while updating the category.');
    }
  }

  onCloseDialog() {
    this.dialogVisible = false;
  }
}
