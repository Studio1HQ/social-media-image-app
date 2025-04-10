
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import type { Image, Comment, Profile, ImagePrivacy } from '@/types';

// Fetch images with optional filtering
export const getImages = async (filter?: string): Promise<Image[]> => {
  try {
    let query = supabase.from('image_stats').select('*');

    if (filter === 'recent') {
      query = query.order('created_at', { ascending: false });
    } else if (filter === 'popular') {
      query = query.order('likes_count', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;
    if (error) throw error;

    // Check if user has liked each image
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (userId && data) {
      const likePromises = data.map(async (image) => {
        const { data: likeData } = await supabase.rpc('has_liked_image', {
          image_uuid: image.image_id
        });
        
        return {
          ...image,
          id: image.image_id,
          liked_by_user: likeData || false,
          privacy: (image.privacy as ImagePrivacy) || 'public'
        } as Image;
      });
      
      return Promise.all(likePromises);
    }

    return data?.map((item) => ({
      ...item,
      id: item.image_id,
      liked_by_user: false,
      privacy: (item.privacy as ImagePrivacy) || 'public'
    } as Image)) || [];
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
};

// Get a single image by ID with details
export const getImageById = async (id: string): Promise<Image | null> => {
  try {
    // Get image with user details
    const { data: imageData, error: imageError } = await supabase
      .from('image_stats')
      .select('*')
      .eq('image_id', id)
      .single();

    if (imageError) throw imageError;
    if (!imageData) return null;

    // Check if user has liked this image
    const userId = (await supabase.auth.getUser()).data.user?.id;
    let liked = false;
    if (userId) {
      const { data: likeData } = await supabase.rpc('has_liked_image', {
        image_uuid: id
      });
      liked = !!likeData;
    }

    return {
      ...imageData,
      id: imageData.image_id,
      liked_by_user: liked,
      privacy: (imageData.privacy as ImagePrivacy) || 'public'
    } as Image;
  } catch (error) {
    console.error('Error fetching image:', error);
    throw error;
  }
};

// Upload an image
export const uploadImage = async (
  imageFile: File, 
  metadata: {
    title: string;
    description?: string;
    tags?: string[];
    privacy: ImagePrivacy;
  }
): Promise<Image> => {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('You must be logged in to upload');

    // Upload image to storage
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, imageFile, {
        contentType: imageFile.type,
        upsert: false
      });

    if (uploadError) throw uploadError;

    // Get the public URL for the uploaded image
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    // Insert image metadata into database
    const { data: imageRecord, error: insertError } = await supabase
      .from('images')
      .insert({
        user_id: user.id,
        title: metadata.title,
        description: metadata.description || null,
        image_url: urlData.publicUrl,
        tags: metadata.tags,
        privacy: metadata.privacy
      })
      .select()
      .single();

    if (insertError) {
      // If inserting failed, try to clean up the uploaded file
      await supabase.storage.from('images').remove([filePath]);
      throw insertError;
    }

    return imageRecord as unknown as Image;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Like an image
export const likeImage = async (imageId: string): Promise<boolean> => {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('You must be logged in to like an image');

    const { data, error } = await supabase
      .from('likes')
      .insert({
        user_id: user.id,
        image_id: imageId
      });

    if (error && error.code === '23505') {
      // Duplicate key error (already liked) - unlike the image
      await supabase
        .from('likes')
        .delete()
        .eq('user_id', user.id)
        .eq('image_id', imageId);
      return false;
    }

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error liking image:', error);
    throw error;
  }
};

// Add a comment to an image
export const addComment = async (imageId: string, content: string): Promise<Comment> => {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('You must be logged in to comment');

    const { data, error } = await supabase
      .from('comments')
      .insert({
        user_id: user.id,
        image_id: imageId,
        content
      })
      .select('*, profiles(username, full_name, profile_image_url)')
      .single();

    if (error) throw error;

    // Format the returned data to match our Comment type
    return {
      id: data.id,
      user_id: data.user_id,
      image_id: data.image_id,
      content: data.content,
      created_at: data.created_at,
      updated_at: data.updated_at,
      username: data.profiles.username,
      full_name: data.profiles.full_name,
      profile_image_url: data.profiles.profile_image_url
    };
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// Get comments for an image
export const getImageComments = async (imageId: string): Promise<Comment[]> => {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*, profiles(username, full_name, profile_image_url)')
      .eq('image_id', imageId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return data.map((comment) => ({
      id: comment.id,
      user_id: comment.user_id,
      image_id: comment.image_id,
      content: comment.content,
      created_at: comment.created_at,
      updated_at: comment.updated_at,
      username: comment.profiles.username,
      full_name: comment.profiles.full_name,
      profile_image_url: comment.profiles.profile_image_url
    }));
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

// Get user profile by username
export const getUserProfile = async (username: string): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single();

    if (error) throw error;
    if (!data) return null;

    // Get follower and following counts
    const userId = data.id;
    const { data: followerCount } = await supabase.rpc('get_follower_count', {
      user_uuid: userId
    });

    const { data: followingCount } = await supabase.rpc('get_following_count', {
      user_uuid: userId
    });

    // Check if current user is following this profile
    const currentUser = (await supabase.auth.getUser()).data.user;
    let isFollowing = false;
    if (currentUser) {
      const { data: followingData } = await supabase.rpc('is_following_user', {
        target_user_uuid: userId
      });
      isFollowing = !!followingData;
    }

    return {
      ...data,
      follower_count: followerCount || 0,
      following_count: followingCount || 0,
      is_following: isFollowing
    } as Profile;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

// Get images by user
export const getUserImages = async (userId: string): Promise<Image[]> => {
  try {
    const { data, error } = await supabase
      .from('image_stats')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Check if current user has liked each image
    const currentUser = (await supabase.auth.getUser()).data.user;
    if (currentUser && data) {
      const likePromises = data.map(async (image) => {
        const { data: likeData } = await supabase.rpc('has_liked_image', {
          image_uuid: image.image_id
        });
        
        return {
          ...image,
          id: image.image_id,
          liked_by_user: likeData || false,
          privacy: (image.privacy as ImagePrivacy) || 'public'
        } as Image;
      });
      
      return Promise.all(likePromises);
    }

    return data?.map((item) => ({
      ...item,
      id: item.image_id,
      liked_by_user: false,
      privacy: (item.privacy as ImagePrivacy) || 'public'
    } as Image)) || [];
  } catch (error) {
    console.error('Error fetching user images:', error);
    throw error;
  }
};

// Follow or unfollow a user
export const followUser = async (targetUserId: string): Promise<boolean> => {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('You must be logged in to follow users');

    // Check if already following
    const { data: existingFollow } = await supabase
      .from('follows')
      .select()
      .eq('follower_id', user.id)
      .eq('following_id', targetUserId)
      .maybeSingle();

    if (existingFollow) {
      // Unfollow
      await supabase
        .from('follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId);
      return false;
    } else {
      // Follow
      await supabase
        .from('follows')
        .insert({
          follower_id: user.id,
          following_id: targetUserId
        });
      return true;
    }
  } catch (error) {
    console.error('Error following/unfollowing user:', error);
    throw error;
  }
};

// Get followers for a user
export const getFollowers = async (userId: string): Promise<Profile[]> => {
  try {
    const { data, error } = await supabase
      .from('follows')
      .select('follower_id, profiles!follower_id(*)')
      .eq('following_id', userId);

    if (error) throw error;
    return data.map((item) => item.profiles) || [];
  } catch (error) {
    console.error('Error fetching followers:', error);
    throw error;
  }
};

// Get users that a user is following
export const getFollowing = async (userId: string): Promise<Profile[]> => {
  try {
    const { data, error } = await supabase
      .from('follows')
      .select('following_id, profiles!following_id(*)')
      .eq('follower_id', userId);

    if (error) throw error;
    return data.map((item) => item.profiles) || [];
  } catch (error) {
    console.error('Error fetching following:', error);
    throw error;
  }
};
