import {Component, input, output} from '@angular/core';
import {Post} from '../../../../core/models/post.interface';

@Component({
  imports: [],
  selector: 'app-edit-post',
  styleUrl: './edit-post.css',
  templateUrl: './edit-post.html',
})
export class EditPost {
  post = input.required<Post>()

  close = output();
  postUpdated = output<Post>();
}
