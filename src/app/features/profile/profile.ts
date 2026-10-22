import {Component, inject, OnInit, signal} from '@angular/core';
import {UserService} from '../../core/services/user.service';

@Component({
  imports: [],
  selector: 'app-profile',
  styleUrl: './profile.css',
  templateUrl: './profile.html',
})
export class Profile implements OnInit {
  private readonly userService = inject(UserService)
  userProfile = this.userService.userProfile;
  ngOnInit() {
    this.userService.getMyProfileData().subscribe({
      next: (res) => {
        console.log(res);
        this.userProfile.set(res.data.user);
      },
      error: err => {
        console.log(err.message);
      },
      complete: () => {}
    })
  }

  onFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const selectedFile = input.files?.item(0);
    if (!selectedFile) return;

    this.userService.uploadProfilePhoto(selectedFile).subscribe({
      next:(res) =>{
        console.log(res);
        // Replace temporary blob with permanent Cloudflare URL
        // this.userProfile.set({ photo: res.data.photo });
        // ❌ Destroys name, email, id, etc.!

        // Keep name, email, _id, etc.
        // Only replace the photo
        this.userProfile.update(current => {
          if(!current) return null;
          return {
            ...current,
            photo: res.data.photo,
          }
        })

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
