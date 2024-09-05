import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ROLE, TOKEN } from './c/comon';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private BASE_URL = "http://localhost:8080";

  constructor(private http: HttpClient) { }


  async login(username:string, password:string):Promise<any>{
    const url = `${this.BASE_URL}/auth/login`;
    try{
      const response =  this.http.post<any>(url, {username, password}).toPromise()
      return response;

    }catch(error){
      throw error;
    }
  }

  async getTransactionById(Id: string, token:string):Promise<any>{
    const url = `${this.BASE_URL}/user/transactions/${Id}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    try{
      const response =  this.http.get<any>(url, {headers}).toPromise()
      return response;
    }catch(error){
      throw error;
    }
  }
  async getAllTransaction(token: string): Promise<any> {
    const url = `${this.BASE_URL}/user/transactions/all`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    try {
      const response = await this.http.get<any>(url, { headers }).toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }
  async getAllCategory(token: string): Promise<any> {
    const url = `${this.BASE_URL}/user/category/all`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    try {
      const response = await this.http.get<any>(url, { headers }).toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  logOut():void{
    if(typeof localStorage !== 'undefined'){
      localStorage.removeItem('token')
      localStorage.removeItem('role')
    }
  }

  isAuthenticated(): boolean {
    if(typeof localStorage !== 'undefined'){
      const token = localStorage.getItem('token');
      return !!token;
    }
    return false;

  }

  

  isUser(): boolean {
    if(typeof localStorage !== 'undefined'){
      const role =  localStorage.getItem('role')
      return role === 'USER'
    }
    return false;

  }
}