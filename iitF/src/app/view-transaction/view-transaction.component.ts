import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { MessageService, ConfirmationService } from 'primeng/api';

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

@Component({
  selector: 'app-view-transaction',
  standalone: true,
  imports: [TableModule, DialogModule, CalendarModule, RippleModule, ButtonModule, ToastModule, ToolbarModule, ConfirmDialogModule, InputTextModule, InputTextareaModule, CommonModule, FileUploadModule, DropdownModule, TagModule, RadioButtonModule, RatingModule, InputTextModule, FormsModule, InputNumberModule],
  templateUrl: './view-transaction.component.html',
  providers: [UserService, MessageService, ConfirmationService],
  styleUrl: './view-transaction.component.scss'
})
export class ViewTransactionComponent implements OnInit {
  transactionDialog: boolean = false;
  transactions!: Transaction[];
  transaction!: Transaction;
  selectedTransactions!: Transaction[] | null;
  submitted: boolean = false;
  type!: any[];
  startDate!: Date;
  endDate!: Date;
  filteredTransactions!: Transaction[];
  globalFilter:any;

  constructor(
    private userService: UserService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.type = [
      { label: 'INCOME', value: 'INCOME' },
      { label: 'EXPENSE', value: 'EXPENSE' }
    ];
  }

  async loadData() {
    try {
      const token: any = localStorage.getItem('token');
      const response = await this.userService.getAllTransaction(token);
      if (response && response.statusCode === 200 && response.transactionList) {
        this.transactions = response.transactionList;
        this.filteredTransactions = this.transactions; // Initialize filteredTransactions with all transactions
        console.log(this.transactions);
      } else {
        console.log('No transactions found.');
      }
    } catch (error: any) {
      console.log(error.message || 'An error occurred while fetching transactions.');
    }
  }

  filterByDateRange() {
    if (this.startDate && this.endDate) {
      this.filteredTransactions = this.transactions.filter(transaction => {
        const transactionDate = new Date(transaction.transactionDate);
        return transactionDate >= this.startDate && transactionDate <= this.endDate;
      });
    } else {
      this.filteredTransactions = this.transactions; // Reset filter if no date range is selected
    }
  }

  resetFilters() {
    
    this.filteredTransactions = this.transactions; // Reset filteredTransactions to all transactions
  }
}
