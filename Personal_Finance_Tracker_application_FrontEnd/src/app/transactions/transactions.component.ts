import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, DatePipe],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {
  transactions: any[] = [];
  amountOfIncome: number = 0;
  amountOfExpense: number = 0;
  errorMessage: string = '';
  dialogVisible: boolean = false;
  transaction1: any;
  categories: any[] = [];
  filteredTransactions: any[] = [];
  filter = {
    startDate: '',
    endDate: ''
  };
  
  createDialogVisible: boolean = false;
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  newTransaction: any = {
    amount: 0,
    description: '',
    transactionDate: '',
    type: '',
    categoryId: null
  };
  constructor(
    private readonly userService: UsersService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.loadCategories();
  }

  async loadData() {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await this.userService.getAllTransaction(token);
        if (response && response.statusCode === 200) {
          this.transactions = response.transactionList;
          this.filteredTransactions = this.transactions;
          this.amountOfIncome = response.amountofIncome;
          this.amountOfExpense = response.amountofExpense;
          this.totalItems = this.filteredTransactions.length; // Initialize totalItems
        } else {
          this.errorMessage = 'No transactions found.';
        }
      } else {
        this.errorMessage = 'Token is missing.';
      }
    } catch (error: any) {
      this.errorMessage = error.message || 'An error occurred while fetching transactions.';
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
      this.errorMessage = 'Token is missing.';
      return;
    }

    try {
      await this.userService.transactionCreate(this.newTransaction, token);
      this.createDialogVisible = false;
      this.loadData(); // Reload data after creating a new transaction
    } catch (error: any) {
      this.errorMessage = error.message || 'An error occurred while creating the transaction.';
    }
  }
  filterByDateRange() {
    console.log('Start Date:', this.filter.startDate);
    console.log('End Date:', this.filter.endDate);

    if (this.filter.startDate && this.filter.endDate) {
      const startDate = new Date(this.filter.startDate);
      const endDate = new Date(this.filter.endDate);
      endDate.setHours(23, 59, 59, 999);

      this.filteredTransactions = this.transactions.filter(transaction => {
        const transactionDate = new Date(transaction.transactionDate);
        return transactionDate >= startDate && transactionDate <= endDate;
      });

      this.totalItems = this.filteredTransactions.length; // Update totalItems based on filtered data
    } else {
      this.filteredTransactions = this.transactions;
      this.totalItems = this.transactions.length; // Reset totalItems to all transactions
    }

    this.currentPage = 1; // Reset to the first page after filtering
    this.searchTransactions(); // Apply search filter if any
  }

  onReset() {
    this.filter.startDate = '';
    this.filter.endDate = '';
    this.searchTerm = ''; // Clear search term
    this.filteredTransactions = this.transactions;
    this.totalItems = this.transactions.length; // Reset totalItems to all transactions
    this.currentPage = 1; // Reset to the first page
  }

  searchTransactions() {
    let filtered = this.transactions;
  
    if (this.searchTerm) {
      // Apply search term filtering
      filtered = filtered.filter(transaction =>
        transaction.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        transaction.amount.toString().includes(this.searchTerm) ||
        transaction.type.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (transaction.category && transaction.category.name.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    }
  
    // Apply date range filter if dates are specified
    if (this.filter.startDate && this.filter.endDate) {
      const startDate = new Date(this.filter.startDate);
      const endDate = new Date(this.filter.endDate);
      endDate.setHours(23, 59, 59, 999);
  
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.transactionDate);
        return transactionDate >= startDate && transactionDate <= endDate;
      });
    }
  
    this.filteredTransactions = filtered;
    this.totalItems = this.filteredTransactions.length; // Update totalItems based on filtered data
    this.currentPage = 1; // Reset to the first page after searching
  }
  

  get paginatedTransactions() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredTransactions.slice(start, end);
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
    this.currentPage = 1; // Reset to first page
    this.loadData(); // Reload data with new items per page
  }

  onEdit(transaction: any) {
    this.transaction1 = { ...transaction }; // Create a copy for editing
    this.dialogVisible = true;
  }

  async onDelete(transactionId: string) {
    if (confirm('Are you sure you want to delete this transaction?')) {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          await this.userService.deleteTransaction(transactionId, token);
          this.loadData(); // Reload data after deletion
        } else {
          this.errorMessage = 'Token is missing.';
        }
      } catch (error: any) {
        this.errorMessage = error.message || 'An error occurred while deleting the transaction.';
      }
    }
  }

  onView(transactionId: string) {
    localStorage.setItem('selectedTransactionId', transactionId);
    this.showDialog();
  }

  showDialog() {
    this.dialogVisible = true;
    this.getTransactionById();
  }

  async getTransactionById() {
    const Id = localStorage.getItem('selectedTransactionId');
    const token = localStorage.getItem('token');
    if (!Id || !token) {
      this.errorMessage = 'Transaction ID or Token is required';
      return;
    }

    try {
      const transactionDataResponse = await this.userService.getTransactionById(Id, token);
      if (transactionDataResponse && transactionDataResponse.statusCode === 200) {
        this.transaction1 = transactionDataResponse.transaction;
      } else {
        this.errorMessage = 'Failed to fetch transaction details.';
      }
    } catch (error: any) {
      this.errorMessage = error.message || 'An error occurred while fetching transaction details.';
    }
  }

  async onSave() {
    const token = localStorage.getItem('token');
    if (!this.transaction1 || !token) {
      this.errorMessage = 'Transaction data or Token is missing.';
      return;
    }
  
    // Prepare the request body according to the specified format
    const updatePayload = {
      amount: this.transaction1.amount,
      description: this.transaction1.description,
      transactionDate: this.transaction1.transactionDate,
      type: this.transaction1.type,
      categoryId: this.transaction1.category.id
    };
  
    try {
      // Call the update method in the UsersService with the prepared payload
      await this.userService.updateTransaction(this.transaction1.id, updatePayload, token);
      this.dialogVisible = false;
      this.loadData(); // Reload data after updating
    } catch (error: any) {
      this.errorMessage = error.message || 'An error occurred while updating the transaction.';
    }
  }
  
  onCloseDialog() {
    this.dialogVisible = false;
  }

  async loadCategories() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'Token is missing.';
      return;
    }
  
    try {
      const response = await this.userService.getAllCategories(token);
      if (response && response.statusCode === 200) {
        this.categories = response.categoryList; // Adjust according to the response format
      } else {
        this.errorMessage = 'Failed to load categories.';
      }
    } catch (error: any) {
      this.errorMessage = error.message || 'An error occurred while fetching categories.';
    }
  }
}
