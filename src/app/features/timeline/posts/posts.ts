import {Component, inject, OnInit, signal} from '@angular/core';
import {PostService} from './services/post.service';
import {Post} from './model/post.interface';

@Component({
  imports: [],
  selector: 'app-posts',
  styleUrl: './posts.css',
  templateUrl: './posts.html',
})
export class Posts implements OnInit {
  private readonly postService = inject(PostService);

  posts = signal<Post[]>([]);
  ngOnInit() {
    this.getPosts()
  }

  getPosts() {
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
