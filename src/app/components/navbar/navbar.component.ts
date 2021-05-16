import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import {MatMenuTrigger} from '@angular/material/menu';
import {ViewChild} from '@angular/core';
import { AuthService } from '../../modules/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent implements OnInit, OnDestroy {
  @ViewChild(MatMenuTrigger, {read: false, static: false}) trigger: MatMenuTrigger;

  public isAuth = false;
  private authSubscription: Subscription;
  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.isAuth = this.authService.getIsAuth();
    this.authSubscription = this.authService.getAuthStatusListener()
                                  .subscribe( isAuth => {
                                    this.isAuth = isAuth;
                                  });
    console.log('statusbar.  is auth', this.isAuth);
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  matMenu() {
    console.log('CLICK ON');
    this.trigger.openMenu();
  }

  logout() {
    this.authService.logouth();
  }

}
