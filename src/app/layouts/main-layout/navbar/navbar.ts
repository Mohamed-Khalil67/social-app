import {Component, ElementRef, HostListener, inject, OnInit, signal} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {UserService} from '../../../core/services/user.service';
import {AuthService} from '../../../core/auth/services/auth.service';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar implements OnInit {
  private readonly router = inject(Router);
  private readonly elementRef = inject(ElementRef);
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  userProfile = this.userService.userProfile;

  ngOnInit() {
    this.userService.getMyProfileData().subscribe({
      next: res => {
        console.log(res);
        this.userProfile.set(res.data.user)
      },
      error: err => {
        console.log(err.message);
      },
      complete: () => {}
    })
  }

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
