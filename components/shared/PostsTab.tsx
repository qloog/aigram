import { fetchUserPosts } from '@/lib/actions/user.action';
import { redirect } from 'next/navigation';
import React from 'react'
import PostCard from '../cards/PostCard';
import { fetchCommunityPosts } from '@/lib/actions/community.action';

interface Result {
  id: string;
  name: string;
  username: string;
  image: string;
  posts: {
    _id: string;
    text: string;
    parentId: string | null;
    author: {
      name: string;
      username: string;
      image: string;
      id: string;
    };
    community: {
      id: string;
      name: string;
      image: string;
    } | null;
    createdAt: string;
    children: {
      author: {
        image: string;
      };
    }[];
  }[];
}

type Props = {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

const PostsTab = async ({ currentUserId, accountId, accountType }: Props) => {
  let result: Result;

  if (accountType === 'Community') {
    result = await fetchCommunityPosts(accountId);
  } else {
    result = await fetchUserPosts(accountId);
  }
  if (!result) redirect('/');

  return (
    <section className='mt-3 flex flex-col gap-1'>
      {result.posts.map((post: any) => (
        <PostCard
          key={post.id}
          id={post.id}
          currentUserId={currentUserId}
          parentId={post.parentId}
          content={post.text}
          author={
            accountType === 'User'
            ? { id: result.id, name: result.name, username: result.username, image: result.image }
            : {
              id: post.author.id,
              name: post.author.name,
              username: post.author.username,
              image: post.author.image,
            }
          } 
          community={
            accountType === "Community"
              ? { name: result.name, id: result.id, image: result.image }
              : post.community
          } // todo
          createdAt={post.createdAt}
          comments={post.children}
        />
      ))}
    </section>
  )
}

export default PostsTab;