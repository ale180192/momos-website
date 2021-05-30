import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

import { Auth } from './auth.model';
import { environment } from '../../../environments/environment';


@Injectable({providedIn: "root"})
export class AuthService {
  private baseUrl = environment.api_url;
  private isAuthenticated = false;
  private token: any;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {
    console.log("init authService");
  }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }


  createUser(username: string, password: string) {
    const authData = {username, password};
    this.http.post(`${this.baseUrl}/api/v1/auth/token`, authData)
              .subscribe(response => {
                console.log(response);
              });
  }

  login(username: string, password: string) {
    const authData: Auth = {username, password};
    this.http.post(`${this.baseUrl}/api/v1/auth/token`, authData)
              .subscribe( (response: any) => {
                this.token = response.token;
                if (response.token) {
                  this.isAuthenticated = true;
                  this.saveAuthData(this.token);
                  this.authStatusListener.next(true);
                }
              }, (error: any) => {
                this.authStatusListener.next(false);
              });
  }

  autoAuth() {
    console.log("call autoAuth");

    const authData: any = this.getAuthData();
    console.log(authData);

    if (!authData) {
      return;
    }

    this.token = authData.token;
    this.isAuthenticated = true;
    this.authStatusListener.next(true);
    console.log('serviceauth, auto', this.isAuthenticated, authData);
  }

  logouth() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private saveAuthData(token: string) {
    console.log("save token", token);

    localStorage.setItem('token', token);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    console.log(token);

    if (!token) {
      return token;
    } else {
      return {token};
    }

  }


}
