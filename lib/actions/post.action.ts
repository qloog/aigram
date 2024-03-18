"use server"

import { revalidatePath } from 'next/cache';
import Post from '../models/post.model';
import User from '../models/user.model';
import { connectToDB } from '../mongoose';

interface Params {
  text: string,
  author: string,
  communityId: string | null,
  path: string,
}

export async function createPost({
  text, author, communityId, path
} : Params) {
  
  try {
    connectToDB();

  const createdPost = await Post.create({
    text,
    author,
    community: null,
    path,
  });

  // update user model
  await User.findByIdAndUpdate(author, {
    $push: {
      posts: createdPost._id,
    }
  });

  revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error creating post: ${error.message}`)
  }
};