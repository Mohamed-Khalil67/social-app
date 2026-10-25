import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {PostService} from './services/post.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Post, PostPaginationInfo} from '../../../core/models/post.interface';


@Component({
  imports: [
    RouterLink
  ],
  selector: 'app-posts',
  styleUrl: './posts.css',
  templateUrl: './posts.html',
})
export class Posts implements OnInit {
  private readonly postService = inject(PostService);
  private activatedRoute = inject(ActivatedRoute);

  // Directly store your domain data
  readonly suggestions = signal<Post[]>([]);
  readonly page = signal<number>(1);
  readonly isLoading = signal<boolean>(false);
  readonly hasMore = signal<boolean>(true);

  posts = signal<Post[]>([]);

  ngOnInit() {
    this.getPostsData()
  }

  getPostsData() {
    if (this.isLoading() || !this.hasMore()) return;

    this.isLoading.set(true);

    this.postService.getHomeFeed('',this.page(), 10).subscribe({
      next: res => {
        console.log(res);
        this.posts.set(res.data.posts);
      },
      error: err => {
        console.log(err.message);
      },
      complete: () => {}
    })
  }

  getMorePosts() {

  }
}
