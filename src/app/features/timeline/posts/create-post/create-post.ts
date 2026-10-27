import {Component, inject, output, signal} from '@angular/core';
import {PostService} from '../services/post.service';
import {form, FormField, required} from '@angular/forms/signals';
import {CreatePostPayload, Post} from '../../../../core/models/post.interface';
import {UserService} from '../../../../core/services/user.service';

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
  private readonly userService = inject(UserService);

  readonly userProfile = this.userService.userProfile;
  readonly isSubmitting = signal<boolean>(false);
  readonly selectedFile = signal<File | null>(null);
  readonly imagePreview = signal<string | null>(null);
  readonly postCreated = output<Post>();

  createPostModel = signal<CreatePostPayload>({body:'',privacy:'public',image:null});

  createPostForm = form(this.createPostModel, (path)=>{
    required(path.body, {
      when: () => !this.selectedFile(),
      message: 'Write something or attach a photo.'
    });
  });

  onFileSelected(event:Event){
    const input = event.target as HTMLInputElement;
    const file  = input.files?.item(0) || null;

    this.selectedFile.set(file);
    this.createPostModel.update((currentState) => {
      return {
        body: currentState.body,       // keep existing body
        privacy: currentState.privacy, // keep existing privacy
        image: file                    // set new file
      };
    });

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      this.imagePreview.set(null);
    }
  }

  // 2. Remove Selected Image
  removeImage(fileInput?: HTMLInputElement): void {
    this.selectedFile.set(null);
    this.imagePreview.set(null);
    if (fileInput) {
      fileInput.value = '';
    }
    this.createPostModel.update((current) => ({ ...current, image: null }));
  }

  private buildFormData(): FormData | null {
    const { body, privacy } = this.createPostModel();
    const file = this.selectedFile();

    if (!body.trim() && !file) return null;

    const formData = new FormData();
    if (body.trim()) formData.append('body', body.trim());
    if (privacy) formData.append('privacy', privacy);
    if (file) formData.append('image', file);

    return formData;
  }

  // State clearance after inputting the body and photo
  private resetForm(fileInput?: HTMLInputElement): void {
    this.createPostModel.set({ body: '', privacy: 'public', image: null });
    this.createPostForm().reset();
    this.selectedFile.set(null);
    this.imagePreview.set(null);
    if (fileInput) fileInput.value = '';
  }

  onCreatePost(fileInput?: HTMLInputElement): void {
    const formData = this.buildFormData();
    if (!formData) return;

    this.isSubmitting.set(true);

    this.postService.createPost(formData).subscribe({
      next: (res) => {
        this.resetForm(fileInput);
        const post = res.data?.post || res.post;
        if (post) this.postCreated.emit(post);
      },
      error: (err) => {
        console.error('Failed to create post:', err);
        this.isSubmitting.set(false);
      },
      complete: () => this.isSubmitting.set(false),
    });
  }
}
