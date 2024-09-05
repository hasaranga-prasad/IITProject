import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';  // Import CurrencyPipe and DatePipe
import { CommonModule } from '@angular/common';  // Import CommonModule
import { UsersService } from '../users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe],  // Add CommonModule to imports
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  amountOfIncome: number = 0;
  amountOfExpense: number = 0;
  errorMessage: string = '';
  visible: boolean = false;
  transactions: any[] = [];
  transaction1: any = null;

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
        const response = await this.userService.getAllTransaction(token) 
        if (response && response.statusCode === 200) {
          this.transactions = response.transactionList;
          this.amountOfIncome = response.amountofIncome;
          this.amountOfExpense = response.amountofExpense;
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

  onView(transactionId: string) {
    localStorage.setItem('selectedTransactionId', transactionId);
    this.showDialog();
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
