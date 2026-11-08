import {Component, computed, effect, inject, input, output, signal} from '@angular/core';
import {DatePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {CommentService} from '../services/comment.service';
import {UserService} from '../../../../core/services/user.service';

@Component({
  imports: [FormsModule, DatePipe],
  selector: 'app-post-comments',
  templateUrl: './post-comments.html',
})
export class PostComments {
  private readonly commentService = inject(CommentService);
  private readonly userService = inject(UserService);

  // the logged-in user: only the author of a comment sees its Delete button
  readonly userProfile = this.userService.userProfile;

  // the post id is given by the parent: <app-post-comments [postId]="post._id" />
  readonly postId = input.required<string>();

  // tells the parent "a comment was added" (the parent updates the post's comment count)
  readonly commentAdded = output<void>();

  // tells the parent "a comment was deleted" (the parent refreshes the post's comment count)
  readonly commentDeleted = output<void>();

  // id of the comment being deleted (disables its button while the request runs)
  readonly deletingCommentId = signal<string | null>(null);

  // only the first page for now
  readonly page = signal<number>(1);

  // READ: loads the comments of this post (re-runs if postId or page changes)
  readonly commentsResource = this.commentService.commentsResource(this.postId, this.page);

  // the plain list the template shows (empty while loading or on error)
  readonly comments = computed(() =>
    this.commentsResource.hasValue() ? this.commentsResource.value().data.comments : []
  );
  // input of the comment , new comment , should be in sync , in order to clear it later when finishing the comment
  newComment = signal<string>('');
  readonly selectedImage = signal<File | null>(null);
  readonly isSending = signal<boolean>(false);
  readonly defaultPhoto = 'https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png';

  constructor() {
    // logging only: lets us check the real shape of the response
    effect(() => {
      if (this.commentsResource.hasValue()) {
        console.log(`[comments] loaded for post ${this.postId()}`, this.commentsResource.value());
      }
    });
  }

  // runs when the user picks a file in the image input
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.item(0);
    this.selectedImage.set(file ? file : null);
    console.log('[comment image] selected', file ? file.name : 'none');
    input.value = ''; // so picking the same file again still triggers (change)
  }

  // ACTION: runs when the author clicks Delete on one of their comments
  onDeleteComment(commentId: string): void {
    if (this.deletingCommentId() || !confirm('Delete this comment?')) return;
    this.deletingCommentId.set(commentId);

    this.commentService.deleteComment(this.postId(), commentId).subscribe({
      next: () => {
        this.deletingCommentId.set(null);
        this.commentDeleted.emit();
        this.commentsResource.reload(); // ask the server for the fresh list
      },
      error: (err) => {
        console.error('[comment delete] failed', err);
        this.deletingCommentId.set(null);
      },
    });
  }

  // ACTION: runs once, when the user clicks Send (or presses Enter)
  addComment(): void {
    const content = this.newComment().trim();
    const image = this.selectedImage();
    if ((!content && !image) || this.isSending()) return; // need text or an image

    const formData = new FormData();
    if (content) formData.append('content', content);
    if (image) formData.append('image', image);

    this.isSending.set(true);
    console.log(`[comment add] POST /posts/${this.postId()}/comments`, content, image ? image.name : 'no image');

    this.commentService.createComment(this.postId(), formData).subscribe({
      next: (res) => {
        console.log('[comment add] success', res);
        this.newComment.set('');
        this.selectedImage.set(null);
        this.isSending.set(false);
        this.commentAdded.emit();
        this.commentsResource.reload(); // ask the server for the fresh list
      },
      error: (err) => {
        console.error('[comment add] failed', err);
        this.isSending.set(false);
      },
    });
  }
}
