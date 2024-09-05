import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

export interface Category {
  id: number;
  name: string;
  type: string;
}

export interface Transaction {
  id: number;
  amount: number;
  description: string;
  transactionDate: string;
  type: string;
  category: Category;
}

export interface TransactionResponseDTO {
  statusCode: number;
  error?: string;
  message?: string;
  amountofIncome: number;
  amountofExpense: number;
  transactionList: Transaction[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TableModule, InputTextModule, CommonModule, ButtonModule, DialogModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  transactions: Transaction[] = [];
  amountOfIncome: number = 0;
  amountOfExpense: number = 0;
  errorMessage: string = '';
  visible: boolean = false;
  transaction1: Transaction | null = null;

  constructor(
    private readonly userService: UserService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  async loadData() {
    try {
      const token: string | null = localStorage.getItem('token');
      if (token) {
        const response = await this.userService.getAllTransaction(token) as TransactionResponseDTO;
        if (response && response.statusCode === 200) {
          this.transactions = response.transactionList;
          this.amountOfIncome = response.amountofIncome;
          this.amountOfExpense = response.amountofExpense;
          console.log(this.transactions);
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
      console.log("Transaction ID or Token is required");
      return;
    }

    try {
      const transactionDataResponse = await this.userService.getTransactionById(Id, token);
      if (transactionDataResponse && transactionDataResponse.statusCode === 200) {
        this.transaction1 = transactionDataResponse.transaction;  
        console.log("Transaction data:", this.transaction1);
      } else {
        console.log('Failed to fetch transaction details.');
      }
    } catch (error: any) {
      console.log(error.message || 'An error occurred while fetching transaction details.');
    }
  }

  onCloseDialog() {
    this.visible = false;  
  }
}

