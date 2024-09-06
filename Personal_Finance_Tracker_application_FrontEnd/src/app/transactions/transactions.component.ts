import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';

import { ToastrModule, ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule,ToastrModule, FormsModule, CurrencyPipe, DatePipe],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {
  transactions: any[] = [];
  amountOfIncome: number = 0;
  amountOfExpense: number = 0;
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
    private readonly router: Router,
    private toastr: ToastrService
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
          this.totalItems = this.filteredTransactions.length; 
        } else {
          this.toastr.error('No transactions found.');
        }
      } else {
        this.toastr.error('Token is missing.');
      }
    } catch (error: any) {
      this.toastr.error('An error occurred while fetching transactions.');
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
      await this.userService.transactionCreate(this.newTransaction, token);
      this.createDialogVisible = false;
      this.toastr.success('Transaction created successfully.');
      this.loadData(); 
    } catch (error: any) {
      this.toastr.error('An error occurred while creating the transaction.');
    }
  }

  filterByDateRange() {
    if (this.filter.startDate && this.filter.endDate) {
      const startDate = new Date(this.filter.startDate);
      const endDate = new Date(this.filter.endDate);
      endDate.setHours(23, 59, 59, 999);

      this.filteredTransactions = this.transactions.filter(transaction => {
        const transactionDate = new Date(transaction.transactionDate);
        return transactionDate >= startDate && transactionDate <= endDate;
      });

      this.totalItems = this.filteredTransactions.length; 
    } else {
      this.filteredTransactions = this.transactions;
      this.totalItems = this.transactions.length; 
    }

    this.currentPage = 1; 
    this.searchTransactions();
  }

  onReset() {
    this.filter.startDate = '';
    this.filter.endDate = '';
    this.searchTerm = ''; 
    this.filteredTransactions = this.transactions;
    this.totalItems = this.transactions.length; 
    this.currentPage = 1; 
  }

  searchTransactions() {
    let filtered = this.transactions;

    if (this.searchTerm) {
      filtered = filtered.filter(transaction =>
        transaction.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        transaction.amount.toString().includes(this.searchTerm) ||
        transaction.type.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (transaction.category && transaction.category.name.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    }

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
    this.totalItems = this.filteredTransactions.length; 
    this.currentPage = 1; 
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
    this.currentPage = 1; 
    this.loadData(); 
  }

  onEdit(transaction: any) {
    this.transaction1 = { ...transaction }; 
    this.dialogVisible = true;
  }

  async onDelete(transactionId: string) {
    if (confirm('Are you sure you want to delete this transaction?')) {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          await this.userService.deleteTransaction(transactionId, token);
          this.toastr.success('Transaction deleted successfully.');
          this.loadData(); 
        } else {
          this.toastr.error('Token is missing.');
        }
      } catch (error: any) {
        this.toastr.error('An error occurred while deleting the transaction.');
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
      this.toastr.error('Transaction ID or Token is required');
      return;
    }

    try {
      const transactionDataResponse = await this.userService.getTransactionById(Id, token);
      if (transactionDataResponse && transactionDataResponse.statusCode === 200) {
        this.transaction1 = transactionDataResponse.transaction;
      } else {
        this.toastr.error('Failed to fetch transaction details.');
      }
    } catch (error: any) {
      this.toastr.error(error.message || 'An error occurred while fetching transaction details.');
    }
  }

  async onSave() {
    const token = localStorage.getItem('token');
    if (!this.transaction1 || !token) {
      this.toastr.error('Transaction data or Token is missing.');
      return;
    }

    const updatePayload = {
      amount: this.transaction1.amount,
      description: this.transaction1.description,
      transactionDate: this.transaction1.transactionDate,
      type: this.transaction1.type,
      categoryId: this.transaction1.category.id
    };

    try {
      await this.userService.updateTransaction(this.transaction1.id, updatePayload, token);
      this.toastr.success('Transaction updated successfully.');
      this.dialogVisible = false;
      this.loadData(); 
    } catch (error: any) {
      this.toastr.error('An error occurred while updating the transaction.');
    }
  }

  onCloseDialog() {
    this.dialogVisible = false;
  }

  async loadCategories() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.toastr.error('Token is missing.');
      return;
    }

    try {
      const response = await this.userService.getAllCategories(token);
      if (response && response.statusCode === 200) {
        this.categories = response.categoryList; 
      } else {
        this.toastr.error('Failed to load categories.');
      }
    } catch (error: any) {
      this.toastr.error( 'An error occurred while fetching categories.');
    }
  }
}
