export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  gender: "male" | "female";
  photo?: string;
  cover?: string;
  username?: string;
  bookmarks: string[];
  followers: string[];
  following: string[];
  followingCount?: number;
  followersCount?: number;
  bookmarksCount?: number;
  createdAt?: string;
}

