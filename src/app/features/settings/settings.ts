import {Component, inject, signal} from '@angular/core';
import {
  form,
  required,
  minLength, validate, FormField, submit,
} from '@angular/forms/signals';
import {AuthService} from '../../core/auth/services/auth.service';

@Component({
  imports: [
    FormField
  ],
  selector: 'app-settings',
  styleUrl: './settings.css',
  templateUrl: './settings.html',
})
export class Settings {
  changePasswordModel = signal({currentPassword: '',newPassword:'', confirmPassword: ''});
  private readonly authService = inject(AuthService);


  changePasswordForm = form(this.changePasswordModel, (path)=>{
    required(path.currentPassword, { message: 'Current password is required.' });

    required(path.newPassword, { message: 'New password is required.' });
    minLength(path.newPassword, 8, { message: 'Password must be at least 8 characters.' });

    validate(path.confirmPassword, ({ value, valueOf }) => {
      if (value() !== valueOf(path.newPassword)) {
        return { kind: 'mismatch', message: 'Passwords do not match' };
      }
      return undefined;
    });
  })

  onSubmit(){
    console.log("token before",localStorage.getItem('userToken'));
    submit(this.changePasswordForm, async () => {
      this.authService.changePassword({
        password: this.changePasswordModel().currentPassword,
        newPassword: this.changePasswordModel().newPassword
      }                            ).subscribe({
        next: (res) => {
          console.log("response", res);
          const token = res.data?.token || res.token;
          if (token) {
            console.log("token",token)
            localStorage.setItem('userToken', token);
          }
        },
        error: (err) => {
          console.log(err.message);
          console.log('Backend error:', err.error?.message);
        },
        complete: () => {
          console.log("change Password Done")
        }
      })
    })

  }
}
