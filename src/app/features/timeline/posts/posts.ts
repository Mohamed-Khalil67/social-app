import {Component, computed, effect, HostListener, inject, OnInit, signal, untracked} from '@angular/core';
import {PostService} from './services/post.service';
import { RouterLink} from '@angular/router';
import {Post} from '../../../core/models/post.interface';
import {CreatePost} from './create-post/create-post';
import {UserService} from '../../../core/services/user.service';
import {EditPost} from './edit-post/edit-post';

@Component({
  imports: [
    RouterLink,
    CreatePost,
    EditPost
  ],
  selector: 'app-posts',
  styleUrl: './posts.css',
  templateUrl: './posts.html',
})
export class Posts{
  readonly postService = inject(PostService);
  readonly userService = inject(UserService);

  readonly userProfile = this.userService.userProfile;
  readonly page = signal<number>(1);
  readonly isLoading = signal<boolean>(false);
  readonly hasMore = signal<boolean>(true);
  editingPost = signal<Post | null>(null)
  posts = signal<Post[]>([]);

  constructor() {
    effect(() => {
      // Reacts whenever the filter changes (and runs once initially on startup!)
      this.postService.activeFilter();
      untracked(() => {
        this.resetAndFetch();
      });
    });
  }

  onSelect(filter: string): void {
    this.postService.setFilter(filter);
    this.resetAndFetch();
  }

  resetAndFetch(): void {
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
        const currentPosts = res.data?.posts || res.posts || [];
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

  onPostCreated(newPost: Post): void {
    if (newPost) {
      this.posts.update((current) => [newPost, ...current]);
    }
  }

  // 🟢 STEP 1: OPEN the modal
  onEditPost(post: Post): void {
    this.editingPost.set(post);
    // Because editingPost is now a Post object,
    // @if (editingPost()) becomes TRUE and the modal pops up!
  }

  // 🔴 STEP 2: FINISH & CLOSE the modal
  onPostUpdated(updatedPost: Post): void {
    // 1. Update the item in your array
    this.posts.update((currentPosts) =>
      currentPosts.map((p) => {
          if(p.id !== updatedPost.id) return p;

          return {
            ...p,
            ...updatedPost,
            user: p.user,
            image: updatedPost.image,
          };
      })
    );

    // 2. Setting it to NULL closes/destroys the modal!
    this.editingPost.set(null);
  }
}
