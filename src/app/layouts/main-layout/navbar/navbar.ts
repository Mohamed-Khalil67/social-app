import {Component, ElementRef, HostListener, inject, signal} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {UserService} from '../../../core/services/user.service';
import {AuthService} from '../../../core/auth/services/auth.service';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar {
  private readonly router = inject(Router);
  private readonly elementRef = inject(ElementRef);
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  userProfile = this.userService.userProfile;

  readonly isMenuOpen = signal<boolean>(false);

  toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeMenu();
    }
  }


  onLogout(): void {
    this.closeMenu();
    this.authService.signOut();
  }
}
