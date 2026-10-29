import {Component, inject, input, linkedSignal, output, signal} from '@angular/core';
import {CreatePostPayload, Post} from '../../../../core/models/post.interface';
import {PostService} from '../services/post.service';
import {form, FormField, required} from '@angular/forms/signals';

@Component({
  imports: [
    FormField
  ],
  selector: 'app-edit-post',
  styleUrl: './edit-post.css',
  templateUrl: './edit-post.html',
})
export class EditPost {
  private readonly postService = inject(PostService);

  post = input.required<Post>()
  close = output();
  postUpdated = output<Post>();

  readonly isSubmitting = signal<boolean>(false);
  readonly selectedFile = signal<File | null>(null);

  editPostModel = linkedSignal<CreatePostPayload>(() =>
    ({
      body: this.post().body || '',
      privacy: this.post().privacy || 'public',
      image: null,
    })
  );

  imagePreview = linkedSignal<string | null>(() => {
    const img = this.post().image;
    return typeof img === 'string' ? img : null;
  });

  editPostForm = form(this.editPostModel, (path)=>{
    required(path.body, {
      when: () => !this.selectedFile() && !this.imagePreview(),
      message: 'Write something or attach a photo.'
    });
  });

  onFileSelected(event:Event){
    const input = event.target as HTMLInputElement;
    const file  = input.files?.item(0) || null;

    this.selectedFile.set(file);
    this.editPostModel.update((currentState) => {
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
    this.editPostModel.update((current) => ({ ...current, image: null }));
  }

  private buildFormData(): FormData | null {
    const { body, privacy } = this.editPostModel();
    const file = this.selectedFile();

    if (!body.trim() && !file && !this.imagePreview()) return null;

    const formData = new FormData();
    if (body.trim()) formData.append('body', body.trim());
    if (privacy) formData.append('privacy', privacy);
    if (file) formData.append('image', file);

    return formData;
  }


  onUpdatePost(fileInput: HTMLInputElement){
    const formData = this.buildFormData();
    if (!formData) return;

    this.isSubmitting.set(true);

    this.postService.editPost(this.post()._id, formData).subscribe({
      next: (res) => {
        const edit = res.data?.post || res.post;
        if (edit) {
          this.postUpdated.emit(edit)
          this.close.emit()
        }
      },
      error: (err) => {
        console.error('Failed to create post:', err);
        this.isSubmitting.set(false);
      },
      complete: () => this.isSubmitting.set(false),
    });
  }

}
