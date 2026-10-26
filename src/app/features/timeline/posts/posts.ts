import {Component, computed, effect, HostListener, inject, OnInit, signal, untracked} from '@angular/core';
import {PostService} from './services/post.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Post, PostPaginationInfo} from '../../../core/models/post.interface';
import {CreatePost} from './create-post/create-post';


@Component({
  imports: [
    RouterLink,
    CreatePost
  ],
  selector: 'app-posts',
  styleUrl: './posts.css',
  templateUrl: './posts.html',
})
export class Posts implements OnInit {
  readonly postService = inject(PostService);
  private activatedRoute = inject(ActivatedRoute);

  readonly page = signal<number>(1);
  readonly isLoading = signal<boolean>(false);
  readonly hasMore = signal<boolean>(true);

  posts = signal<Post[]>([]);

  constructor() {
    effect(() => {
      const filter = this.postService.activeFilter();
      // untracked ensures signals updated inside don't trigger an infinite loop
      untracked(() => {
        this.resetAndFetch(filter);
      });
    });
  }

  ngOnInit() {}

  onSelect(filter: string): void {
    this.postService.setFilter(filter);
  }

  resetAndFetch(filter: string): void {
    this.page.set(1);
    this.hasMore.set(true);
    this.posts.set([]);
    this.getPostsData();
  }

  getPostsData() {
    // when arriving here is loading is false in order to pass this step
    if (this.isLoading() || !this.hasMore()) return;

    this.isLoading.set(true);

    this.postService.getHomeFeed(this.postService.activeFilter(),this.page(), 10).subscribe({
      next: res => {
        const currentPosts = res.data.posts;
        console.log(res);

        if(currentPosts.length === 0){
          this.hasMore.set(false);
        } else {
          if (this.page() === 1) {
            this.posts.set(currentPosts);
          } else {
            this.posts.update(current => [...current, ...currentPosts]);
          }
          this.page.update(p => p + 1);
        }
        this.isLoading.set(false);
      },
      error: err => {
        console.log("Error fetching posts",err.message);
        this.isLoading.set(false);
      },
      complete: () => {
      }
    })
  }

  // 6. Listen for window scroll events
  @HostListener('window:scroll')
  onScroll(): void {
    const bottomReached =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 300;

    if (bottomReached) {
      this.getPostsData();
    }
  }

  onDeletePost(){}

  onEditPost(){}
}
