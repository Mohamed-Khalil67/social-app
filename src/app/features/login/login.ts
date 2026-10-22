import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/services/auth.service';

@Component({
  imports: [RouterLink, ReactiveFormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  isLoading = false;

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  onLogin(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      console.log('Login Form Submitted:', this.loginForm.value);
      this.authService.signIn(this.loginForm.value).subscribe({
        next: (res) => {
          console.log('login submission success: ', res);
          const token = res.data.token;
          if (token) {
            localStorage.setItem('userToken', token);
          }
          this.router.navigate(['/timeline']).then(r => {});
        },
        error: (err) => {
          this.isLoading = false;
          console.log('login submission error: ', err);
        },
        complete: () => {
          console.log('login completed: ', this.loginForm.value);
          this.isLoading = false;
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}


