import PostCard from '@/components/cards/PostCard'
import CommentForm from '@/components/forms/CommentForm';
import { fetchPostById } from '@/lib/actions/post.action';
import { fetchUser } from '@/lib/actions/user.action';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react'

const page = async ({ params }: { params: { id: string } }) => {
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

      <div className='mt-7'>
        <CommentForm 
          postId={JSON.stringify(post._id)}
          currentUserImg={userInfo.image}
          currentUserId={JSON.stringify(userInfo._id)}
        />
      </div>

      {/* comment list */}
      <div className='mt-10'>
        {post.children.map((comment: any) => (
          <PostCard 
            key={comment._id}
            id={comment._id}
            currentUserId={user.id}
            parentId={comment.parentId}
            content={comment.text}
            createdAt={comment.createdAt}
            comments={comment.children}
            author={comment.author}
            community={comment.community}
            isComment
          />
        ))}
      </div>
    </section>
  )
}

export default page