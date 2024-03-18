import PostForm from '@/components/forms/PostForm';
import { fetchUser } from '@/lib/actions/user.action';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (userInfo === null || !userInfo.onboarded) redirect('/onboarding');

  return (
    <>
      <h1 className='head-text'>create post</h1>
      <PostForm userId={userInfo._id} />
    </>
  )
}

export default Page;