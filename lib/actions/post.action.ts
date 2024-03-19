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

export async function fetchPosts(page = 1, pageSize = 20) {
  connectToDB();

  // calculate the number of posts to skip
  const skipAmount = (page - 1) * pageSize;

  // fetch the posts that have no parents(top-level posts...)
  const postsQuery = Post.find({ parentId: { $in : [null, undefined] }})
    .sort({ createdAt: 'desc' })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({ 
      path : 'author', 
      model: User,
    })
    // .populate({ 
    //   path : 'children',
    //   populate: {
    //     path : 'author',
    //     model: User,
    //     select: '_id name parentId image'
    //   },
    // });

    const totalCount = await Post.countDocuments({ parentId: { $in : [null, undefined]}});

    const posts = await postsQuery.exec();

    const isNext = totalCount > skipAmount + posts.length;

    return { posts, isNext, totalCount };
}