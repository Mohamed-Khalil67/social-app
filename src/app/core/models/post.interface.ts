export type PostPrivacy = 'public' | 'following' | 'only_me';

export interface PostCreator {
  _id: string;
  name: string;
  username?: string;
  photo?: string;
}

export interface PostComment {
  _id: string;
  content: string;
  commentCreator: PostCreator;
  createdAt: string;
  image?: string | object;
}

export interface Post {
  _id: string;
  body?: string;
  image?: string | object;
  user: PostCreator;
  privacy: PostPrivacy;
  createdAt: string;
  likesCount?: number;
  commentsCount?: number;
  sharesCount?: number;
  comments?: PostComment[];
}

export interface CreatePostPayload {
  body?: string;
  privacy: PostPrivacy;
  image?: File | object | null;
}
