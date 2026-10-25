import {Component, inject} from '@angular/core';
import {PostService} from '../posts/services/post.service';

@Component({
  imports: [],
  selector: 'app-side-left',
  styleUrl: './side-left.css',
  templateUrl: './side-left.html',
})
export class SideLeft {
  readonly postService = inject(PostService);

  onSelect(filter: string) {
    this.postService.setFilter(filter);
  }
}
