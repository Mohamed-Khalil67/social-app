import { Component, inject, OnInit } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Navbar} from './navbar/navbar';
import {UserService} from '../../core/services/user.service';

@Component({
  imports: [RouterOutlet, Navbar],
  selector: 'app-main-layout',
  styleUrl: './main-layout.css',
  templateUrl: './main-layout.html',
})
export class MainLayout implements OnInit {
  private readonly userService = inject(UserService);

  ngOnInit() {
    this.userService.loadProfile();
  }
}
