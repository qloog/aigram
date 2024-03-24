import UserCard from '@/components/cards/UserCard';
import { fetchUser, fetchUsers, getActivity } from '@/lib/actions/user.action';
import { currentUser } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import React from 'react'

const Page = async () => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (userInfo === null || !userInfo.onboarded) redirect('/onboarding');

  // get activities
  const activity = await getActivity(userInfo._id);

  return (
    <section>
      <h1 className='head-text mb-10'>Activity</h1>

      <section className='mt-10 flex flex-col gap-5'>
        {activity.length > 0 ? (
          <>
            {activity.map((activity: any) => (
              <Link 
                key={activity._id}
                href={`/posts/${activity.parentId}`}
              >
                <article className='activity-card'>
                  <Image 
                    src={activity.author.image}
                    alt={activity.author.name}
                    width={20}
                    height={20}
                    className='rounded-full object-cover'
                  />
                  <p className='!text-small-regular text-light-1'>
                    <span className='mr-1 text-primary-500'>
                      {activity.author.name}
                    </span>{" "}
                    replies to your post
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className='!text-base-regular text-light-3'>You have no activity yet</p>
        )}
      </section>
    </section>
  )
}

export default Page;