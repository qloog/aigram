"use server"

import { revalidatePath } from 'next/cache';
import User from '../models/user.model';
import { connectToDB } from '../mongoose'

interface Params {
  userId: string;
  username: string;
  name: string;
  image: string;
  bio: string;
  path: string;
}

export async function fetchUser(userId: string) {
  try {
    connectToDB();

    return await User.findOne({ id: userId });
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

export async function updateUser({
  userId,
  username,
  name,
  image,
  bio,
  path 
}: Params): Promise<void> {
  connectToDB();

  try {
    await User.findOneAndUpdate(
      { id: userId },
      { 
        username: username.toLowerCase(), 
        name: name, 
        bio: bio, 
        image: image, 
        onboarded: true,
      },
      { upsert: true }
    );
  
     if (path === '/profile/edit') {
      revalidatePath(path);
     }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    connectToDB();

    // Find all posts authored by user with the given userId
    const posts = await User.findOne({ id: userId })
      .populate({
        path: 'posts',
        model: 'Post',
        populate: {
          path: 'children',
          model: 'Post',
          populate: {
            path: 'author',
            model: 'User',
            select: 'id name image'
          }
        }
      });

      return posts;
  } catch (error: any) {
    throw new Error(`Failed to fetch user posts: ${error.message}`);
  }
}