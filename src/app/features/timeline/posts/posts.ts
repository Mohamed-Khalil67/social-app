import {
  Component, computed,
  effect,
  HostListener,
  inject, linkedSignal,
  signal
} from '@angular/core';
import {PostService} from './services/post.service';
import {RouterLink} from '@angular/router';
import {Post, PostPrivacy} from '../../../core/models/post.interface';
import {CreatePost} from './create-post/create-post';
import {UserService} from '../../../core/services/user.service';
import {EditPost} from './edit-post/edit-post';
import {SearchPipe} from '../../../shared/pipes/search-pipe';
import {FormsModule} from '@angular/forms';


@Component({
  imports: [
    RouterLink,
    CreatePost,
    EditPost,
    SearchPipe,
    FormsModule,
  ],
  selector: 'app-posts',
  styleUrl: './posts.css',
  templateUrl: './posts.html',
})
export class Posts{

  readonly postService = inject(PostService);
  readonly userService = inject(UserService);

  text = signal<string>('')

  readonly userProfile = this.userService.userProfile;
  readonly page = linkedSignal({
    source:() => this.postService.activeFilter(),
    computation: (filter) => {
      console.log(`[1 page] filter is "${filter}" -> page reset to 1`);
      return 1;
    }
  })
  // posts.ts, below page
  readonly feed = this.postService.feedResource(this.page);

  readonly isLoading = this.feed.isLoading;
  readonly hasMore = computed<boolean>(() => { return this.feed.hasValue() ? this.feed.value().data.posts.length > 0 : true });
  editingPost = signal<Post | null>(null)

  readonly posts = linkedSignal<Post[] | undefined, Post[]>({
    source: () => this.feed.hasValue() ? this.feed.value().data.posts : undefined,
    computation: (fresh, prev) => {
      const oldList = prev ? prev.value : [];

      if (fresh === undefined) {
        console.log(`[3 posts] loading... keep ${oldList.length} posts`);
        return oldList;
      }
      if (this.page() === 1) {
        console.log(`[3 posts] page 1 arrived -> replace with ${fresh.length} posts`);
        return fresh;
      }
      console.log(`[3 posts] page ${this.page()} arrived -> add ${fresh.length} to ${oldList.length}`);
      return oldList.concat(fresh);
    },
  });

  constructor() {
    effect(() => console.log(`[status] feed is "${this.feed.status()}"`));
  }

  onPrivacy(post: Post, event: Event){
    const selectedElement = event.target as HTMLSelectElement;
    const selectedValue = selectedElement.value;

    console.log('Selected privacy:', selectedValue);

    // 1. Initialize FormData and append the key expected by your backend API
    const formData = new FormData();
    formData.append('privacy', selectedValue);

    // 2. Pass formData to the service and subscribe to trigger the request
    this.postService.editPost(post._id, formData).subscribe({
      next: (res) => {
        console.log(formData.get('privacy')); // Sync the local model on success
        console.log('Privacy updated successfully:', res);
        this.posts.update((current) =>
          current.map((p) => (p._id === post._id ? { ...p, privacy: selectedValue as PostPrivacy } : p))
        );
      },
      error: (err) => {
        console.error('Failed to update privacy:', err);
      },
      complete: () => {

      }
    });
  }

  onSelect(filter: string): void {
    console.log(`[0 click] tab "${filter}" selected`);
    this.postService.setFilter(filter);
  }

  // 6. Listen for window scroll events
  @HostListener('window:scroll')
  onScroll(): void {
    const bottomReached =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 300;

    if (!bottomReached || this.isLoading() || !this.hasMore()) return;

    console.log(`[scroll] bottom reached -> loading page ${this.page() + 1}`);
    this.page.update(p => p +1);

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
