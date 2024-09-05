import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { UserService } from '../user.service';
import { TabMenuModule } from 'primeng/tabmenu';
import { MenuItem, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MenubarModule } from 'primeng/menubar';
@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [ 
    CommonModule, 
    TabMenuModule, 
    ToastModule,
    ButtonModule,
    MenubarModule 
  ], 
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'] 
})
export class NavComponent implements OnInit {

  items: MenuItem[] = [];
  isAuthenticated: boolean = false;
  isUser:boolean = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
   this.updateAuthState()
  }

  updateAuthState(): void {
    this.isAuthenticated = this.userService.isAuthenticated();
    if (this.isAuthenticated) {
      this.loadMenuItems();
    }
  }

  loadMenuItems(): void {
    this.items = this.getMenuItems();
  }

  getMenuItems(): MenuItem[] {
    return [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        command: () => this.router.navigate(['/home'])
      },
      {
        label: 'Transactions',
        icon: 'pi pi-chart-line',
        items: [  
          {
            label: 'View All',
            icon: 'pi pi-list',
            command: () => this.router.navigate(['/viewalltransactions'])
          },
          {
            label: 'Add New',
            icon: 'pi pi-plus',
            command: () => this.router.navigate(['/add-transaction'])
          }
        ]
      },
      {
        label: 'Category',
        icon: 'pi pi-list',
        command: () => this.router.navigate(['/category'])
      },
      {
        label: 'Profile',
        icon: 'pi pi-user',
        command: () => this.router.navigate(['/profile'])
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => this.logout()
      }
    ];
  }

  logout(): void {
    this.userService.logOut();
    this.isAuthenticated = false;
    this.isUser = false;
    this.messageService.add({ severity: 'success', summary: 'Logged Out', detail: 'You have been successfully logged out.' });
    this.router.navigate(['/login']);
  }
}
