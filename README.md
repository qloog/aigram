This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Tech Stack

- Next.js
- MongoDB
- Shadcn UI
- TailwindCSS
- Clerk
- Webhooks
- Serverless APIs
- React Hook Form
- Zod
- TypeScript

## Porject Features

### 初始化项目

```bash
mkdir aigram
cd aigram
npx create-next-app@latest ./
```

### 安装依赖库

```bash
npm install @clerk/nextjs @uploadthing/react mongoose svix uploadthing
```

运行server

```bash
npm run dev
```

### 简化 app/page.tsx

移除相关无用code, 仅保留

```tsx
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      AIgram
    </main>
  );
}
```

修改 globals.css 和 tailwind.config.ts

报错：`Error: Cannot find module 'tailwindcss-animate'`
修改：安装 `tailwindcss-animate`

```bash
npm install tailwindcss-animate
```

### 添加登录和注册认证

在 app 目录下创建:

1. `(auth)/sign-in/[[...sign-in]]page.tsx` 和 `(auth)/sign-up/[[...sign-up]]/page.tsx` 文件，并新建 `(auth)/layout.tsx`。
2. `(root)`, 并将 `app/layout.tsx` 和 `app/page.tsx` 移至 `(root)` 根目录下

3. 在 clerk 新建应用，并在 `.env.local` 配置 key  
4. 补充 `(auth)` 目录下的各 `page.tsx` 内容
5. 新增中间件 `middleware.ts`

> clerk 官方文档：
> https://clerk.com/docs/quickstarts/setup-clerk
> https://clerk.com/docs/quickstarts/nextjs

### 增加组件

- topbar
- leftsidebar
- bottombar
- rightsidebar

### 个人页面

```bash
# 初始化 shadcn-ui 并配置
npx shadcn-ui@latest init

npx shadcn-ui@latest add form
```

完善 `onboarding` 个人资料修改页面

### 上传图片

1. 安装 `uploadthing`, 安装命令 `npm install uploadthing @uploadthing/react`
2. 创建 `lib/uploadthing.ts`
3. 创建 `api/uploadting/core.ts` 和 `api/uploadting/route.ts`

> uploadthing 官方文档：https://docs.uploadthing.com/

### 增加链接 mongo 客户端

```bash
# libs/mongoose.ts
```

### 操作用户信息

- 获取用户信息
- 修改用户信息

### 创建post

新增页面并增加对应内容

### 完善Home页面

获取 post 列表并使用 `PostCard` 渲染展示

### 增加post详情页

- 展示post详情
- 增加评论框
- 评论列表

### 增加 profile 页

### 增加 serarch 页

- 默认获取自己发布过的帖子

### 增加 activity 页

### 增加 communities 页

增加 webhook/clerk

## References

- svg图片转ico: https://favicon.io/
- https://www.youtube.com/watch?v=O5cmLDVTgAs
- [Instagram Style Route as Modal in Next.js](https://www.youtube.com/watch?v=EyjuRCxpf6Y)