import {Component, inject, OnInit, signal} from '@angular/core';
import {PostService} from './services/post.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Post} from './model/post.interface';

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

  posts = signal<Post[]>([]);

  ngOnInit() {
    this.getPostsData()
  }

  getPostsData() {
    this.postService.getAllPosts().subscribe({
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
}
