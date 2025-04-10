export interface User {
  id: string;
  email: string;
  username: string;
  full_name?: string;
  bio?: string;
  profile_image_url?: string;
}

export type ImagePrivacy = 'public' | 'private' | 'unlisted';

export interface Image {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  image_url: string;
  tags?: string[];
  privacy: ImagePrivacy;
  created_at: string;
  updated_at: string;
  username?: string;
  full_name?: string;
  profile_image_url?: string;
  likes_count: number;
  comments_count: number;
  liked_by_user?: boolean;
}

export interface Comment {
  id: string;
  user_id: string;
  image_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  username?: string;
  full_name?: string;
  profile_image_url?: string;
}

export interface Profile {
  id: string;
  username: string;
  full_name?: string;
  bio?: string;
  profile_image_url?: string;
  created_at: string;
  updated_at: string;
  follower_count?: number;
  following_count?: number;
  is_following?: boolean;
}

export interface Like {
  id: string;
  user_id: string;
  image_id: string;
  created_at: string;
}

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}
