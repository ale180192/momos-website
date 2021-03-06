import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });
  public isAuthenticated = this.authService.getIsAuth();
  private authSubscription: Subscription;
  public isLoading = false;
  public signupUrl: string = "auth/signup"

  constructor( private fb: FormBuilder, private router: Router, private authService: AuthService ) {
    this.authSubscription = this.authService.getAuthStatusListener().subscribe( (isAuth: any) => {
      this.isAuthenticated = isAuth;
      this.isLoading = false;
      if (isAuth)
        this.router.navigate(['/home']);
    });
    if (this.isAuthenticated) {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit() {
  }

  onSubmit() {
    console.log('Login\'s data', this.loginForm.value);
    this.isLoading = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.authService.login(this.loginForm.value.username, this.loginForm.value.password);
  }

}
