"use client";

import { z } from "zod"
import { useForm } from "react-hook-form"
import { usePathname, useRouter } from 'next/navigation'
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from '@/components/ui/textarea'

import { commentValidation } from '@/lib/validations/post'
import { addCommentToPost, createPost } from '@/lib/actions/post.action';
import Image from 'next/image';

interface Props {
  postId: string;
  currentUserImg: string;
  currentUserId: string;
}

const CommentForm = ({ postId, currentUserImg, currentUserId }: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof commentValidation>>({
    resolver: zodResolver(commentValidation),
    defaultValues: {
      post: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof commentValidation>) => {
    await addCommentToPost(
      JSON.parse(postId), 
      values.post, 
      JSON.parse(currentUserId),
      pathname
    );

    form.reset();
  }

  return (
    <Form {...form}>
      <form 
        className="comment-form"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="post"
          render={({ field }) => (
            <FormItem className='flex items-center gap-3 w-full'>
              <FormLabel>
                <Image
                  src={currentUserImg}
                  alt="User avatar"
                  width={48}
                  height={48}
                  className='rounded-full object-cover'
                />
              </FormLabel>
              <FormControl className='border-none bg-transparent'>
                <Textarea 
                  rows={2}
                  placeholder="Write a comment..."
                  className='account-form_input no-focus'
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className='comment-form_btn'>
          Reply
        </Button>
      </form>
    </Form>
  )
}

export default CommentForm;