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
        path: path
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