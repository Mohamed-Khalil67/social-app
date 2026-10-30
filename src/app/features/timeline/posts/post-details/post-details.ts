import {Component, inject, OnInit, signal} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {PostService} from '../services/post.service';
import {Post} from '../../../../core/models/post.interface';

@Component({
  imports: [],
  selector: 'app-post-details',
  styleUrl: './post-details.css',
  templateUrl: './post-details.html',
})
export class PostDetails implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly postService = inject(PostService);
  private readonly location = inject(Location);

  postData = signal<Post | null>(null);

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe({
      next: (params) => {
        const postId = params.get('id');
        if (postId) {
          this.postService.getSinglePost(postId).subscribe({
            next: (res) => {
              this.postData.set(res.data?.post || res.post || null);
            },
            error: (err) => {
              console.error('Failed to load post details:', err);
            }
          });
        }
      }
    });
  }

  goBack(): void {
    this.location.back()
  }

}
