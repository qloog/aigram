import { fetchUserPosts } from '@/lib/actions/user.action';
import { redirect } from 'next/navigation';
import React from 'react'
import PostCard from '../cards/PostCard';

type Props = {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

const PostsTab = async ({ currentUserId, accountId, accountType }: Props) => {
  // fetch user posts
  let result = await fetchUserPosts(accountId);
  if (!result) redirect('/');

  return (
    <section className='mt-9 flex flex-col gap-10'>
      {result.posts.map((post: any) => (
        <PostCard
          key={post.id}
          id={post.id}
          currentUserId={currentUserId}
          parentId={post.parentId}
          content={post.text}
          author={
            accountType === 'User'
            ? { id: result.id, name: result.name, image: result.image }
            : {
              id: post.author.id,
              name: post.author.name,
              image: post.author.image,
            }
          } 
          community={post.community} // todo
          createdAt={post.createdAt}
          comments={post.children}
        />
      ))}
    </section>
  )
}

export default PostsTab;