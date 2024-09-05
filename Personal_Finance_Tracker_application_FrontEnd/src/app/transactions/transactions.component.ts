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

  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;

  constructor(
    private readonly userService: UsersService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  async loadData() {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await this.userService.getAllTransaction(token);
        if (response && response.statusCode === 200) {
          this.transactions = response.transactionList;
          this.amountOfIncome = response.amountofIncome;
          this.amountOfExpense = response.amountofExpense;
          this.totalItems = parseInt(response.size, 10) || 0; // Ensure totalItems is a number
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

  get paginatedTransactions() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.transactions.slice(start, end);
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
}
