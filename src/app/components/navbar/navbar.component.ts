import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import {MatMenuTrigger} from '@angular/material/menu';
import {ViewChild} from '@angular/core';
import { AuthService } from '../../pages/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent implements OnInit, OnDestroy {
  @ViewChild(MatMenuTrigger, {read: false, static: false}) trigger: MatMenuTrigger;

  public isAuth = false;
  private authSubscription: Subscription;
  public sessionMessage: string = "Login";
  public loginUrl: string = "auth/login"
  constructor(private router: Router, private authService: AuthService) {
    console.log("init navbar");
    authService.autoAuth()

  }

  ngOnInit() {
    this.isAuth = this.authService.getIsAuth();
    this.authSubscription = this.authService.getAuthStatusListener()
                              .subscribe( isAuth => {
                                console.log("event from authService with: ", isAuth);

                                this.isAuth = isAuth;
                                if (isAuth) {
                                  this.sessionMessage = "Logout"
                                  this.loginUrl = "auth/logout"
                                }
                                else {
                                  this.sessionMessage = "Login"
                                  this.loginUrl = "auth/login"
                                }
                              });
    console.log("isAuth: ", this.isAuth);

    if (this.isAuth) {
      this.sessionMessage = "Logout"
    }
    else {
      this.sessionMessage = "Login"
    }
}


  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  matMenu() {
    console.log('CLICK ON');
    this.trigger.openMenu();
  }

  SessionAction() {
    if (this.isAuth) {
      this.authService.logouth();
      this.router.navigate([this.loginUrl]);
    } else {
      this.router.navigate([this.loginUrl]);
    }
  }

}
