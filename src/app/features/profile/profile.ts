import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { PostService } from '../timeline/posts/services/post.service';
import { Post, PostPrivacy } from '../../core/models/post.interface';
import { EditPost } from '../timeline/posts/edit-post/edit-post';
import { PostComments } from '../timeline/posts/post-comments/post-comments';

@Component({
  imports: [RouterLink, FormsModule, DatePipe, EditPost, PostComments],
  selector: 'app-profile',
  styleUrl: './profile.css',
  templateUrl: './profile.html',
})
export class Profile {
  private readonly userService = inject(UserService);
  private readonly postService = inject(PostService);

  readonly userProfile = this.userService.userProfile;
  readonly activeTab = signal<'my-posts' | 'saved'>('my-posts');

  // Declarative httpResource: automatically runs when userProfile() arrives with an _id
  readonly postsResource = this.userService.getPostsProfile(() => this.userProfile()?._id);

  // Explicit source & computation: preserves old posts while re-fetching
  readonly posts = linkedSignal<Post[] | undefined, Post[]>({
    source: () => (this.postsResource.hasValue() ? this.postsResource.value().data.posts : undefined),
    computation: (fresh, prev) => {
      const oldList = prev ? prev.value : [];
      if (fresh === undefined) return oldList;
      return fresh;
    },
  });

  readonly isLoading = this.postsResource.isLoading;

  readonly totalPostsCount = computed<number>(() => {
    if (this.postsResource.hasValue()) {
      return this.postsResource.value().meta?.pagination?.total ?? this.posts().length;
    }
    return this.posts().length;
  });

  // Modal / interaction states
  readonly editingPost = signal<Post | null>(null);
  readonly openCommentsPostId = signal<string | null>(null);
  readonly sharingPostId = signal<string | null>(null);
  readonly shareText = signal<string>('');
  readonly deletingPostId = signal<string | null>(null);

  onFileUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const selectedFile = input.files?.item(0);
    if (!selectedFile) return;

    this.userService.uploadProfilePhoto(selectedFile).subscribe({
      next: (res) => {
        console.log('[profile photo] uploaded', res);
        const photo = res.data?.photo;
        if (photo) {
          this.userService.updatePhoto(photo);
        }
      },
      error: (err) => {
        console.error('Upload failed:', err);
      },
      complete: () => {
        input.value = ''; // Reset so choosing the same file again triggers (change)
      },
    });
  }

  isLiked(post: Post): boolean {
    const me = this.userProfile();
    if (!me || !post.likes) return false;
    return post.likes.includes(me._id);
  }

  onLike(postId: string): void {
    this.postService.toggleLike(postId).subscribe({
      next: () => this.refreshPost(postId),
      error: (err) => console.error('[like] failed', err),
    });
  }

  toggleComments(postId: string): void {
    this.openCommentsPostId.update((curr) => (curr === postId ? null : postId));
  }

  onCommentAdded(postId: string): void {
    this.refreshPost(postId);
  }

  toggleShare(postId: string): void {
    this.shareText.set('');
    this.sharingPostId.update((curr) => (curr === postId ? null : postId));
  }

  onShare(postId: string): void {
    const text = this.shareText();
    this.postService.sharePost(postId, text).subscribe({
      next: () => {
        this.sharingPostId.set(null);
        this.shareText.set('');
        this.refreshPost(postId);
      },
      error: (err) => console.error('[share] failed', err),
    });
  }

  onPrivacy(post: Post, event: Event): void {
    const select = event.target as HTMLSelectElement;
    const privacy = select.value as PostPrivacy;
    const formData = new FormData();
    formData.append('privacy', privacy);

    this.postService.editPost(post._id, formData).subscribe({
      next: () => {
        this.posts.update((current) =>
          current.map((p) => (p._id === post._id ? { ...p, privacy } : p))
        );
      },
      error: (err) => console.error('[privacy update] failed', err),
    });
  }

  onEditPost(post: Post): void {
    this.editingPost.set(post);
  }

  onPostUpdated(updatedPost: Post): void {
    this.posts.update((current) =>
      current.map((p) => {
        if (p._id !== updatedPost._id && p.id !== updatedPost.id) return p;
        return {
          ...p,
          ...updatedPost,
          user: p.user ?? this.userProfile() ?? p.user,
          image: updatedPost.image,
        };
      })
    );
    this.editingPost.set(null);
  }

  onDeletePost(postId: string): void {
    if (!confirm('Are you sure you want to delete this post?')) return;
    this.deletingPostId.set(postId);

    this.postService.deletePost(postId).subscribe({
      next: () => {
        // server confirmed -> now remove it from the screen
        this.posts.update((current) => current.filter((p) => p._id !== postId));
        this.deletingPostId.set(null);
      },
      error: (err) => {
        console.error('[delete post] failed', err);
        this.deletingPostId.set(null); // keep the post, re-enable the button
      },
    });
  }

  private refreshPost(postId: string): void {
    this.postService.getSinglePost(postId).subscribe({
      next: (res) => {
        const fresh = res.data?.post;
        if (fresh) {
          this.posts.update((current) =>
            current.map((p) => (p._id === postId ? fresh : p))
          );
        }
      },
      error: (err) => console.error('[refresh post] failed', err),
    });
  }
}
