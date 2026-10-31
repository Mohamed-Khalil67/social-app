import {Component, inject, OnInit, signal} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {PostService} from '../services/post.service';
import {Post} from '../../../../core/models/post.interface';
import {PostComments} from '../post-comments/post-comments';
import {UserService} from '../../../../core/services/user.service';

@Component({
  imports: [PostComments],
  selector: 'app-post-details',
  styleUrl: './post-details.css',
  templateUrl: './post-details.html',
})
export class PostDetails implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly postService = inject(PostService);
  private readonly location = inject(Location);
  private readonly userService = inject(UserService);

  readonly userProfile = this.userService.userProfile;

  postData = signal<Post | null>(null);

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe({
      next: (params) => {
        const postId = params.get('id');
        if (postId) {
          this.postService.getSinglePost(postId).subscribe({
            next: (res) => {
              this.postData.set(res.data.post);
            },
            error: (err) => {
              console.error('Failed to load post details:', err);
            }
          });
        }
      }
    });
  }

  // a comment was added: fetch the fresh post so its comment count is correct
  onCommentAdded(): void {
    this.refreshPost();
  }

  // did the logged-in user like this post?
  isLiked(post: Post): boolean {
    const me = this.userProfile();
    if (!me || !post.likes) return false;
    return post.likes.includes(me._id);
  }

  onLike(): void {
    const post = this.postData();
    if (!post) return;

    console.log(`[like] toggle post ${post._id}`);
    this.postService.toggleLike(post._id).subscribe({
      next: (res) => {
        console.log('[like] success', res);
        this.refreshPost();
      },
      error: (err) => console.error('[like] failed', err),
    });
  }

  private refreshPost(): void {
    const post = this.postData();
    if (!post) return;

    this.postService.getSinglePost(post._id).subscribe({
      next: (res) => this.postData.set(res.data.post),
      error: (err) => console.error('Failed to refresh post:', err),
    });
  }

  goBack(): void {
    this.location.back()
  }

}
