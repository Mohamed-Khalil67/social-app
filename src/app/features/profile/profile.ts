import {Component, inject} from '@angular/core';
import {UserService} from '../../core/services/user.service';

@Component({
  imports: [],
  selector: 'app-profile',
  styleUrl: './profile.css',
  templateUrl: './profile.html',
})
export class Profile {
  private readonly userService = inject(UserService)
  userProfile = this.userService.userProfile;

  onFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const selectedFile = input.files?.item(0);
    if (!selectedFile) return;

    this.userService.uploadProfilePhoto(selectedFile).subscribe({
      next:(res) =>{
        console.log(res);
        // the service replaces only the photo and keeps name, email, _id, etc.
        this.userService.updatePhoto(res.data.photo);

      },
      error: (err) => {
        console.error('Upload failed:', err);
      },
      complete: () => {
        input.value = ''; // Reset so choosing the same file again triggers (change)
      },
    });
  }

}
