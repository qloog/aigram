import PostCard from '@/components/cards/PostCard';
import { fetchPosts } from '@/lib/actions/post.action';
import { fetchUser } from '@/lib/actions/user.action';
import { UserButton, currentUser } from '@clerk/nextjs';

import Image from "next/image";
import { redirect } from 'next/navigation';

export default async function Home() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (userInfo && !userInfo.onboarded) redirect('/onboarding');

  const result = await fetchPosts(1, 10);

  return (
    <>
      <h1 className='head-text'>Home here</h1>

      <section className='mt-9 flex flex-col gap-10'>
        {result.posts.length === 0 ? (
          <p className='no-result'>No posts found</p>
        ) : (
          <>
          {result.posts.map((post) => (
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
          ))}
          </>
        )}
      </section>
    </>
  )
}
