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
  userProfile = signal<any>(null)
  ngOnInit() {
    this.userService.getMyProfileData().subscribe({
      next: res => {
        console.log(res);
        this.userProfile.set(res.data.user)
      },
      error: err => {console.log(err.message);},
      complete: () => {}
    })
  }
}
