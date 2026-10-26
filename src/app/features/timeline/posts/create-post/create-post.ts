import {Component, inject, signal} from '@angular/core';
import {PostService} from '../services/post.service';
import {form, FormField } from '@angular/forms/signals';
import {CreatePostPayload} from '../../../../core/models/post.interface';

@Component({
  imports: [
    FormField
  ],
  selector: 'app-create-post',
  styleUrl: './create-post.css',
  templateUrl: './create-post.html',
})
export class CreatePost {
  private readonly postService = inject(PostService);

  readonly isSubmitting = signal(false);
  readonly selectedFile = signal<File | null>(null);
  readonly imagePreview = signal<string | null>(null);

  createPostModel = signal<CreatePostPayload>({body:'',privacy:'only_me',image:null});

  createPostForm = form(this.createPostModel, (path)=>{
  })

  onFileSelected(event:Event){
    const input = event.target as HTMLInputElement;
    const file  = input.files?.item(0) || null;

    this.createPostModel.update((currentState) => {
      return {
        body: currentState.body,       // keep existing body
        privacy: currentState.privacy, // keep existing privacy
        image: file                    // set new file
      };
    });
  }

  onCreatePost(){
    // this.postService.createPost().subscribe({
    //   next: ()=>{},
    //   error: ()=>{},
    //   complete: ()=>{},
    // })
  }
}
