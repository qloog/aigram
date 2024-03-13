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

报错：`The `bg-dark-2` class does not exist.`
修复：

报错：`Error: Cannot find module 'tailwindcss-animate'`
修改：安装 `tailwindcss-animate`

```bash
npm install tailwindcss-animate
```


