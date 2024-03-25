import Image from 'next/image';
import { currentUser } from '@clerk/nextjs';
import { communityTabs } from '@/constants';
import PostForm from '@/components/forms/PostForm';
import ProfileHeader from '@/components/shared/ProfileHeader';
import PostsTab from '@/components/shared/PostsTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchCommunityDetails } from '@/lib/actions/community.action';
import UserCard from '@/components/cards/UserCard';

async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) return null;

  const communityDetail = await fetchCommunityDetails(params.id)

  return (
    <section>
      <ProfileHeader 
        accountId={communityDetail.id}
        authUserId={communityDetail.id}
        name={communityDetail.name}
        username={communityDetail.username}
        imgUrl={communityDetail.image}
        bio={communityDetail.bio}
        type="Community"
      />

      <div className='mt-9'>
        <Tabs defaultValue='posts' className='w-full'>
          <TabsList className='tab'>
            {communityTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className='tab'>
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
                    {communityDetail?.posts?.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="posts" className='w-full text-light-1'>
            <PostsTab 
              currentUserId={user.id}
              accountId={communityDetail._id}
              accountType='Community'
            />
          </TabsContent>
          <TabsContent value="members" className='w-full text-light-1'>
            <section className='mt-9 flex flex-col gap-10'>
              {communityDetail.members.map((member: any) => (
                <UserCard 
                  key={member.id}
                  id={member.id}
                  name={member.name}
                  username={member.username}
                  imgUrl={member.image}
                  personType='User'
                />
              ))}
            </section>
          </TabsContent>
          <TabsContent value="requests" className='w-full text-light-1'>
            <PostsTab 
              currentUserId={user.id}
              accountId={communityDetail._id}
              accountType='Community'
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

export default Page;