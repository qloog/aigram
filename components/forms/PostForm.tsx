"use client";

import { z } from "zod"
import { useForm } from "react-hook-form"
import { usePathname, useRouter } from 'next/navigation'
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from '@/components/ui/textarea'

import { postValidation } from '@/lib/validations/post'
import { createPost } from '@/lib/actions/post.action';
import { useOrganization } from '@clerk/nextjs';

interface Props {
  user: {
    id: string;
    objectId: string;
    username: string | null;
    name: string;
    bio: string;
    image: string;
  }
  btnTitle: string;
}

function PostForm({ userId }: { userId: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { organization } = useOrganization();

  // 1. Define your form.
  const form = useForm<z.infer<typeof postValidation>>({
    resolver: zodResolver(postValidation),
    defaultValues: {
      post: "",
      accountId: userId,
    },
  })

  const onSubmit = async (values: z.infer<typeof postValidation>) => {
    await createPost({
      text: values.post,
      author: userId, 
      communityId: organization ? organization.id : null,
      path: pathname
    });

    router.push('/');
  }

  return (
    <Form {...form}>
      <form 
        className="flex flex-col justify-start gap-10"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="post"
          render={({ field }) => (
            <FormItem className='flex flex-col gap-3 w-full'>
              <FormLabel className='text-base-semibold text-light-2'>
                Content
              </FormLabel>
              <FormControl>
                <Textarea 
                  rows={10}
                  className='account-form_input no-focus'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className='bg-primary-500'>
          Create Post
        </Button>
      </form>
    </Form>
  );
}

export default PostForm;