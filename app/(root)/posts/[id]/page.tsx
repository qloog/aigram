import PostCard from '@/components/cards/PostCard'
import { fetchPostById } from '@/lib/actions/post.action';
import { fetchUser } from '@/lib/actions/user.action';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react'

const page = async ({ params }: { id: string}) => {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (userInfo && !userInfo.onboarded) redirect('/onboarding');

  const post = await fetchPostById(params.id);

  return (
    <section>
      <div>
        <PostCard 
          key={post._id}
          id={post._id}
          currentUserId={user.id}
          parentId={post.parentId}
          content={post.text}
          createdAt={post.createdAt}
          comments={post.children}
          author={post.author}
          community={post.community}      
        /> 
      </div>
    </section>
  )
}

export default page