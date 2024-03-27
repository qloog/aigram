import Image from 'next/image';
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs';
import ProfileHeader from '@/components/shared/ProfileHeader';
import { fetchUser } from '@/lib/actions/user.action';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { profileTabs } from '@/constants';
import PostsTab from '@/components/shared/PostsTab';

async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(params.id);
  if (userInfo === null || !userInfo.onboarded) redirect('/onboarding');

  return (
    <section>
      <ProfileHeader 
        accountId={userInfo.id}
        authUserId={user.id}
        name={userInfo.name}
        username={userInfo.username}
        imgUrl={userInfo.image}
        bio={userInfo.bio}
      />

      <div className='mt-5'>
        <Tabs defaultValue='posts' className='w-full'>
          <TabsList className='tab'>
            {profileTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className='tab'>
                <Image 
                  src={tab.icon}
                  width={24}
                  height={24}
                  alt={tab.label}
                  className='obejct-contain'
                />
                <p className='max-sm:hidden'>{tab.label}</p>

                {tab.value === 'posts' && (
                  <p className='ml-1 rounded-sm bg-light-4 px-2 py-1
                  !text-tiny-medium text-light-2'>
                    {userInfo?.posts?.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="posts" className='w-full text-light-1'>
            <PostsTab 
              currentUserId={user.id}
              accountId={userInfo.id}
              accountType='User'
            />
          </TabsContent>
          <TabsContent value="replies" className='w-full text-light-1'>
            developing...
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

export default Page;