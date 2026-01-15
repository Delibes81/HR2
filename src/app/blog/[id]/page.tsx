import { getBlogPostById, generateStaticParams as generateBlogStaticParams } from "@/lib/blog";
import { notFound } from "next/navigation";
import Image from "next/image";

type BlogPostPageProps = {
  params: {
    id: string;
  };
};

export async function generateStaticParams() {
  return generateBlogStaticParams();
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPostById(params.id);

  if (!post) {
    notFound();
  }

  return (
    <article className="container py-12 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tighter text-center">{post.title}</h1>
        <p className="mt-4 text-center text-muted-foreground">
          Publicado por {post.author}
        </p>
      </header>
      <Image
        src={post.image}
        alt={post.title}
        width={1200}
        height={600}
        className="rounded-lg shadow-lg object-cover w-full aspect-[2/1] mb-8"
        priority
      />
      <div className="text-lg leading-relaxed space-y-6 whitespace-pre-line">
        {post.content}
      </div>
    </article>
  );
}
