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

## References

- svg图片转ico: https://favicon.io/