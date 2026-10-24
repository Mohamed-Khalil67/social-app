import {Component, computed, DestroyRef, inject, OnInit, signal} from '@angular/core';
import { RouterLink } from '@angular/router';
import {UserService} from '../../core/services/user.service';
import {SuggestedPaginationInfo, SuggestedUser} from '../../core/models/user.interface';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  imports: [RouterLink],
  selector: 'app-suggestions',
  styleUrl: './suggestions.css',
  templateUrl: './suggestions.html',
})
export class Suggestions implements OnInit {
  private readonly userService = inject(UserService);

  // Directly store your domain data
  readonly suggestions = signal<SuggestedUser[]>([]);
  readonly pagination = signal<SuggestedPaginationInfo | null>(null);
  readonly isLoading = signal<boolean>(false);

  // Computed reactively: true as long as backend provides a nextPage!
  readonly hasMore = computed<boolean>(() => {return Boolean(this.pagination()?.nextPage)});

  ngOnInit() {
    this.isLoading.set(true);
    this.userService.getSuggestions(1,10).subscribe({
      next:(res) => {
        console.log(res);
        this.suggestions.set(res.data.suggestions);
        if(res.meta?.pagination){
          this.pagination.set(res.meta?.pagination);
        }
      },
      error: err => {
        console.log(err.message);
        this.isLoading.set(false);
      },
      complete: () => {
        console.log('completed call suggestions');
        this.isLoading.set(false);
      }
    })
  }

  onFollow(user: SuggestedUser){
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

  onLoadMore(){
    const nextPage = this.pagination()?.nextPage;
    // 1. Guard against duplicate calls or when there are no more pages
    if (this.isLoading() || !nextPage) {
      return;
    }

    this.userService.getSuggestions(nextPage, 10).subscribe({
      next:(res) => {
        const newUsers = res.data.suggestions;
        this.suggestions.update(currentUsers =>
          [...currentUsers, ...newUsers]
        );
        if(res.meta?.pagination){
          this.pagination.set(res.meta.pagination);
        }
      },
      error: err => {
        console.log(err.message);
        this.isLoading.set(false);
      },
      complete: () => {
        console.log("Completed call More suggestions");
        this.isLoading.set(false);
      }
    })
  }
}
