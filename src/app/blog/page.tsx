import { getBlogPosts } from "@/lib/blog";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
<div className="container mx-auto px-4 py-12">
  <div className="text-center mb-12">
    <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl">
      Nuestro Blog
    </h1>
    <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-lg">
      Noticias, consejos y todo lo que necesitas saber sobre bienestar y recuperación.
    </p>
  </div>

  {posts.length === 0 ? (
    <p className="text-center text-muted-foreground">
      Aún no hay publicaciones en el blog. ¡Vuelve pronto!
    </p>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
      {posts.map((post) => (
        <Link key={post.id} href={`/blog/${post.id}`} className="group">
          <Card className="h-full flex flex-col">
            <CardHeader className="p-0">
              <Image
                src={post.image}
                alt={post.title}
                width={600}
                height={400}
                className="object-cover w-full h-48 rounded-t-lg group-hover:scale-105 transition-transform duration-300"
              />
            </CardHeader>
            <CardContent className="p-6 flex-grow">
              <CardTitle className="font-headline text-xl group-hover:text-primary transition-colors">
                {post.title}
              </CardTitle>
              <CardDescription className="mt-2 text-sm">
                Por {post.author}
              </CardDescription>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )}
</div>

  );
}
