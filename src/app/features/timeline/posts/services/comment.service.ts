import {inject, Service} from '@angular/core';
import {HttpClient, httpResource} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PostComment} from '../../../../core/models/post.interface';

@Service()
export class CommentService {
  private http = inject(HttpClient);

  // ---------- READS (httpResource) ----------

  // Rule of thumb: if the data appears on screen without the user doing anything,
  // it’s a read, so use httpResource. If the user clicks and something changes, it’s an action, so use HttpClient.

  // GET a post's comments
  commentsResource(postId: () => string | undefined, page: () => number) {
    return httpResource<{ data: { comments: PostComment[] } }>(() => {
      const id = postId();
      if (!id) return undefined; // no post id yet -> no request

      return {
        url: `/posts/${id}/comments`,
        params: { page: page(), limit: 10 },
      };
    });
  }

  // GET the replies of one comment
  repliesResource(postId: () => string | undefined, commentId: () => string | undefined, page: () => number) {
    return httpResource<{ data: { replies: PostComment[] } }>(() => {
      const id = postId();
      const cId = commentId();
      if (!id || !cId) return undefined;

      return {
        url: `/posts/${id}/comments/${cId}/replies`,
        params: { page: page(), limit: 10 },
      };
    });
  }

  // ---------- ACTIONS (HttpClient) ----------

  createComment(postId: string, data: FormData): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`/posts/${postId}/comments`, data);
  }

  createReply(postId: string, commentId: string, data: FormData): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`/posts/${postId}/comments/${commentId}/replies`, data);
  }

  updateComment(postId: string, commentId: string, data: FormData): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`/posts/${postId}/comments/${commentId}`, data);
  }

  deleteComment(postId: string, commentId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`/posts/${postId}/comments/${commentId}`);
  }

  toggleCommentLike(postId: string, commentId: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`/posts/${postId}/comments/${commentId}/like`, {});
  }
}
