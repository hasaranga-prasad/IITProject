import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent implements OnInit {

  constructor(private readonly userService: UsersService){}

  isAuthenticated:boolean = false;

  isUser:boolean = false;


  ngOnInit(): void {
      this.isAuthenticated = this.userService.isAuthenticated();
     
      this.isUser = this.userService.isUser();
  }

  logout():void{
    this.userService.logOut();
    this.isAuthenticated = false;
    this.isUser = false;
  }
}
