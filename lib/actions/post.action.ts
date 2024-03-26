"use server"

import { revalidatePath } from 'next/cache';
import Post from '../models/post.model';
import User from '../models/user.model';
import { connectToDB } from '../mongoose';
import Community from '../models/community.model';

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

    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    const createdPost = await Post.create({
      text,
      author,
      community: communityIdObject, // Assign communityId if provided, or leave it null for personal account
      path,
    });

    // update user model
    await User.findByIdAndUpdate(author, {
      $push: {
        posts: createdPost._id,
      }
    });

    if (communityIdObject) {
      // Update Community model
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { posts: createdPost._id },
      });
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create post: ${error.message}`)
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
    .populate({ 
      path : 'community',
      model: Community,
    })
    .populate({ 
      path : 'children',
      populate: {
        path : 'author',
        model: User,
        select: '_id name parentId image'
      },
    });

    // Count the total number of top-level posts i.e., posts that are not comments.
    const totalCount = await Post.countDocuments({ parentId: { $in : [null, undefined]}});

    const posts = await postsQuery.exec();

    const isNext = totalCount > skipAmount + posts.length;

    return { posts, isNext, totalCount };
}

async function fetchAllChildPosts(postId: string): Promise<any[]> {
  const childPosts = await Post.find({ parentId: postId });

  const descendantPosts = [];
  for (const childPost of childPosts) {
    const descendants = await fetchAllChildPosts(childPost._id);
    descendantPosts.push(childPost, ...descendants);
  }

  return descendantPosts;
}

export async function deletePost(id: string, path: string): Promise<void> {
  try {
    connectToDB();

    // Find the post to be deleted (the main thread)
    const mainPost = await Post.findById(id).populate("author community");

    if (!mainPost) {
      throw new Error("Post not found");
    }

    // Fetch all child threads and their descendants recursively
    const descendantPosts = await fetchAllChildPosts(id);

    // Get all descendant thread IDs including the main thread ID and child thread IDs
    const descendantPostIds = [
      id,
      ...descendantPosts.map((post) => post._id),
    ];

    // Extract the authorIds and communityIds to update User and Community models respectively
    const uniqueAuthorIds = new Set(
      [
        ...descendantPosts.map((post) => post.author?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainPost.author?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    const uniqueCommunityIds = new Set(
      [
        ...descendantPosts.map((post) => post.community?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainPost.community?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    // Recursively delete child threads and their descendants
    await Post.deleteMany({ _id: { $in: descendantPostIds } });

    // Update User model
    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { posts: { $in: descendantPostIds } } }
    );

    // Update Community model
    await Community.updateMany(
      { _id: { $in: Array.from(uniqueCommunityIds) } },
      { $pull: { posts: { $in: descendantPostIds } } }
    );

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete post: ${error.message}`);
  }
}

export async function fetchPostById(id: string) {
  connectToDB();

  try {
    const post = await Post.findById(id)
    .populate({ 
      path : 'author', 
      model: User,
      select: '_id id name username image'
    })
    .populate({
      path: "community",
      model: Community,
      select: "_id id name image",
    }) // Populate the community field with _id and name
    .populate({ 
      path : 'children',
      populate: [
        {
          path : 'author',
          model: User,
          select: '_id name parentId image'
        },
        {
          path : 'children',
          model: Post,
          populate: {
            path : 'author',
            model: User,
            select: '_id id name parentId image'
          }
        }
      ]
    }).exec();

    return post;
  } catch (error: any) {
    throw new Error(`Error fetching post: ${error.message}`)
  }
}

export async function addCommentToPost(
  postId: string, 
  commentText: string,
  userId: string,
  path: string,
) {
  connectToDB();

  try {
    // find the original post by its id
    const originalPost = await Post.findById(postId);
    if (!originalPost) {
      throw new Error('Post not found');
    }

    // create a new post with the comment text
    const comment = new Post({
      text: commentText,
      author: userId,
      parentId: postId,
    });

    // save the new comment
    const savedComment = await comment.save();

    // update the original post with the new comment
    originalPost.children.push(savedComment._id);

    // save the original post
    await originalPost.save();

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error adding comment to post: ${error.message}`)
  }
}