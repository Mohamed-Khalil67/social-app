import { Component, ElementRef, inject, OnDestroy, output, signal, viewChild } from '@angular/core';
import { PostService } from '../services/post.service';
import { form, FormField, required } from '@angular/forms/signals';
import { CreatePostPayload, Post } from '../../../../core/models/post.interface';
import { UserService } from '../../../../core/services/user.service';
import { AsyncState } from '../../../../core/models/async-state';

@Component({
  imports: [FormField],
  selector: 'app-create-post',
  styleUrl: './create-post.css',
  templateUrl: './create-post.html',
})
export class CreatePost implements OnDestroy {
  private readonly postService = inject(PostService);
  private readonly userService = inject(UserService);

  private readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  ngOnDestroy() {
    this.clearImage();
  }

  // forget the chosen image: revoke its preview url and empty the <input type="file">
  clearImage(): void {
    const url = this.imagePreview();
    if (url) URL.revokeObjectURL(url);
    this.imagePreview.set(null);
    this.selectedFile.set(null);
    const input = this.fileInput()?.nativeElement;
    if (input) input.value = '';
  }

  readonly userProfile = this.userService.userProfile;
  readonly submitState = signal<AsyncState<Post>>(AsyncState.idle());
  readonly selectedFile = signal<File | null>(null);
  readonly imagePreview = signal<string | null>(null);
  readonly postCreated = output<Post>();

  createPostModel = signal<CreatePostPayload>({ body: '', privacy: 'public', image: null });

  createPostForm = form(this.createPostModel, (path) => {
    required(path.body, {
      when: () => !this.selectedFile(),
      message: 'Write something or attach a photo.',
    });
  });

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.item(0);
    if (!file) return;

    const oldUrl = this.imagePreview();
    if (oldUrl) URL.revokeObjectURL(oldUrl);
    this.selectedFile.set(file);
    this.imagePreview.set(URL.createObjectURL(file));
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
  // runs after a successful post and on the form's native (reset) event (the "Clear" button)
  protected resetForm(): void {
    this.createPostModel.set({ body: '', privacy: 'public', image: null });
    this.createPostForm().reset();
    this.clearImage();
    this.submitState.set(AsyncState.idle());
  }

  onCreatePost(): void {
    const formData = this.buildFormData();
    if (!formData || this.submitState().status === 'loading') return;

    this.submitState.set(AsyncState.loading());

    this.postService.createPost(formData).subscribe({
      next: (res) => {
        const post = res.data.post;
        if (post) {
          this.submitState.set(AsyncState.success(post));
          this.postCreated.emit(post);
        }
        this.resetForm();
      },
      error: (err) => {
        const message = err?.error?.message || 'Failed to create post. Please try again.';
        this.submitState.set(AsyncState.error(message));
        console.error('Failed to create post:', err);
      },
    });
  }
}
