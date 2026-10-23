import {Component, inject} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {AuthService} from '../../core/auth/services/auth.service';



@Component({
  imports: [RouterLink, ReactiveFormsModule],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  private authService = inject(AuthService);
  private readonly router = inject(Router);
  isLoading:boolean = false;
  registerForm: FormGroup = new FormGroup(
    {
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
      ]),
      username: new FormControl('',Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      gender: new FormControl('', [Validators.required]),
      dateOfBirth: new FormControl('', [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^[A-Z](?=.*?[^a-zA-Z0-9\s])/),
      ]),
      rePassword: new FormControl('', [Validators.required]),
    },
    { validators: [this.passwordMatchValidator] }
  );

  onRegister(): void {
    if (this.registerForm.valid) {
      console.log('Register Form Submitted data sent:',  this.registerForm.value);
      this.isLoading = true
      this.authService.signUp(this.registerForm.value).subscribe({
        next: (value) => {
          console.log('response:',value);
        },
        error:(err) => {
          console.log(err.message);
        },
        complete: () => {
          this.router.navigateByUrl('/login');
          console.log('complete of subscribe:',this.registerForm.value);
        }
      })
    } else {
      console.log('Register Form Not Submitted:', this.registerForm);
      this.isLoading = false
      // this.registerForm.getRawValue() , can get me a disabled
      this.registerForm.markAllAsTouched();
    }
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const rePassword = control.get('rePassword')?.value;
    return password && rePassword && password !== rePassword
      ? { mismatch: true }
      : null;
  }
}


