export type PostPrivacy = 'public' | 'following' | 'only_me' | 'only-me' | 'followers';

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
  likes?: string[];
  likesCount?: number;
  repliesCount?: number;
}

export interface Post {
  _id: string;
  id?: string;
  body?: string;
  image?: string | object;
  user: PostCreator;
  privacy: PostPrivacy;
  createdAt: string;
  likesCount?: number;
  commentsCount?: number;
  sharesCount?: number;
  comments?: PostComment[];
  topComment?: PostComment;
  likes?: string[];
  bookmarked?: boolean;
}

export interface CreatePostPayload {
  body?: string;
  privacy: PostPrivacy;
  image?: File | object | null;
}
