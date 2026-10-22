import {Component, inject, OnInit, signal} from '@angular/core';
import { RouterLink } from '@angular/router';
import {UserService} from '../../core/services/user.service';

interface suggestedUser {
  followersCount: number;
  mutualFollowersCount: number;
  name: string;
  photo: string;
  username: string;
  _id: string;
  isFollowing?: boolean;
}

@Component({
  imports: [RouterLink],
  selector: 'app-suggestions',
  styleUrl: './suggestions.css',
  templateUrl: './suggestions.html',
})
export class Suggestions implements OnInit {
  private readonly userService = inject(UserService);
  readonly suggestions = signal<any[]>([]);
  ngOnInit() {
    this.userService.getSuggestions().subscribe({
      next:(res) => {
        console.log(res);
        this.suggestions.set(res.data.suggestions || res.data || '');
      },
      error: err => {
        console.log(err.message);
      },
      complete: () => {
        console.log('completed call suggestions');
      }
    })
  }

  onFollow(user: suggestedUser){
    this.userService.toggleFollowUser(user._id).subscribe({
      next:(res) => {
        this.suggestions.update(currentUsers =>
          currentUsers.map(u => u._id === user._id ? { ...u, isFollowing: !u.isFollowing} : u))
        console.log("Following state",res);
      },
      error: err => {
        console.log(err.message);
      },
      complete: () => {}
    })
  }
}
