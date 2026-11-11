import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/services/auth.service';
import { AsyncState } from '../../core/models/async-state';

@Component({
  imports: [RouterLink, ReactiveFormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly loginState = signal<AsyncState<void>>(AsyncState.idle());

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  onLogin(): void {
    if (this.loginForm.valid) {
      this.loginState.set(AsyncState.loading());
      console.log('Login Form Submitted:', this.loginForm.value);

      this.authService.signIn(this.loginForm.value).subscribe({
        next: (res) => {
          console.log('login submission success: ', res);
          const token = res.data?.token;
          if (token) {
            localStorage.setItem('userToken', token);
          }
          this.loginState.set(AsyncState.success(undefined));
          this.router.navigate(['/timeline']);
        },
        error: (err) => {
          const message = err?.error?.message || 'Login failed. Please check your credentials.';
          this.loginState.set(AsyncState.error(message));
          console.log('login submission error: ', err);
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
