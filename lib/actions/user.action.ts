"use server"

import { revalidatePath } from 'next/cache';
import User from '../models/user.model';
import { connectToDB } from '../mongoose'
import { FilterQuery, SortOrder } from 'mongoose';
import Post from '../models/post.model';

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
        model: Post,
        populate: {
          path: 'children',
          model: Post,
          populate: {
            path: 'author',
            model: User,
            select: 'id name image'
          }
        }
      });

      return posts;
  } catch (error: any) {
    throw new Error(`Failed to fetch user posts: ${error.message}`);
  }
}

export async function fetchUsers({ 
  userId,
  searchString = '',
  pageNumber = 1,
  pageSize = 20,
  sortBy = 'desc'
 }: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
 }) {
  try {
    connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;
    // Create a case-insensitive regular expression
    const regex = new RegExp(searchString, 'i');
    // Create an initial query object to filter users.
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId }
    };

    if (searchString.trim() !== '') {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } }
      ];
    }

    const sortOptions = { createdAt: sortBy };

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalCount = await User.countDocuments(query);

    // Find users
    const users = await usersQuery.exec();

    const isNext = totalCount > skipAmount + users.length;

    return {
      users,
      totalCount,
      isNext
    };
  } catch (error: any) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }
}

export async function getActivity(userId: string) {
  try {
    connectToDB();

    // Find all posts created by the user
    const userPosts = await Post.find({ author: userId });

    // Collect all the child post ids (replies) from the 'children' field of each user post
    const childPostIds = userPosts.reduce((acc, userPost) => {
      return acc.concat(userPost.children);
    } , []);

    const replies = await Post.find({
      _id: { $in: childPostIds },
      author: { $ne: userId }
    }).populate({
      path: 'author',
      model: User,
      select: 'name image _id'
    });
    
    return replies;
  } catch (error: any) {
    throw new Error(`Failed to fetch activity: ${error.message}`);
  }
}