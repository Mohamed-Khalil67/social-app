import { Component, inject } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Navbar} from './navbar/navbar';
import {UserService} from '../../core/services/user.service';

@Component({
  imports: [
    RouterOutlet,
    Navbar
  ],
  selector: 'app-main-layout',
  styleUrl: './main-layout.css',
  templateUrl: './main-layout.html',
})
export class MainLayout {
  constructor() {
    // every logged-in page lives inside this layout, so the profile is loaded once, before any page needs it
    inject(UserService).loadProfile();
  }
}
