import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';  
import { CommonModule } from '@angular/common';  
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { UsersService } from '../users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, DatePipe],  // Add FormsModule to imports
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  transactions: any[] = [];
  amountOfIncome: number = 0;
  amountOfExpense: number = 0;
  errorMessage: string = '';
  visible: boolean = false;
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
      const token: string | null = localStorage.getItem('token');
      if (token) {
        const response = await this.userService.getAllTransaction(token);
        if (response && response.statusCode === 200) {
          this.transactions = response.transactionList;
          this.amountOfIncome = response.amountofIncome;
          this.amountOfExpense = response.amountofExpense;
          this.totalItems = parseInt(response.size, 10); // Parse size as an integer
        } else {
          console.log('No transactions found.');
        }
      } else {
        console.log('Token is missing.');
      }
    } catch (error: any) {
      console.log(error.message || 'An error occurred while fetching transactions.');
    }
  }

  get paginatedTransactions() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.transactions.slice(start, end);
  }

  onView(transactionId: string) {
    localStorage.setItem('selectedTransactionId', transactionId);
    this.showDialog();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  onItemsPerPageChange(items: number) {
    this.itemsPerPage = items;
    this.currentPage = 1; // Reset to first page
  }

  showDialog() {
    this.visible = true;
    this.getTransactionById();
  }

  async getTransactionById() {
    const Id = localStorage.getItem('selectedTransactionId');
    const token = localStorage.getItem('token');
    if (!Id || !token) {
      this.errorMessage = "Transaction ID or Token is required";
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

  onCloseDialog() {
    this.visible = false;
  }
}
