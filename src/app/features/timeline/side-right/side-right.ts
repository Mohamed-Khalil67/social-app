import {Component, inject, signal} from '@angular/core';
import {UserService} from '../../../core/services/user.service';
import {RouterLink} from '@angular/router';
import {SuggestedUser} from '../../../core/models/user.interface';

@Component({
  imports: [
    RouterLink
  ],
  selector: 'app-side-right',
  styleUrl: './side-right.css',
  templateUrl: './side-right.html',
})
export class SideRight {
  private readonly userService = inject(UserService);

  suggestedUsers = signal<SuggestedUser[]>([])

  ngOnInit() {
    this.userService.getSuggestions(1,5).subscribe({
      next: (res) => {
        this.suggestedUsers.set([...res.data.suggestions])
      },
      error: err => console.log(err.message),
      complete:() => {}
    })
  }

  onFollow(user: SuggestedUser): void {
    this.userService.toggleFollowUser(user._id).subscribe({
      next: (res) => {
        this.suggestedUsers.update((current) =>
          current.map((u) =>
            u._id === user._id ? {...u, isFollowing : !u.isFollowing} : u
          )
        );
      },
      error: err => console.log(err.message),
      complete: () => {}
    })
  }
}
