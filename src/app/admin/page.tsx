
"use client";

import { ProductList } from "@/components/admin/product-list";
import { CategoryList } from "@/components/admin/category-list";
import { BlogPostList } from "@/components/admin/blog-post-list";
import { TestimonialList } from "@/components/admin/testimonial-list";
import { TeamMemberList } from "@/components/admin/team-member-list";
import { MetricList } from "@/components/admin/metric-list";
import { PromoBannerForm } from "@/components/admin/promo-banner-form";
import { TiktokEmbedForm } from "@/components/admin/tiktok-embed-form";
import { FaqList } from "@/components/admin/faq-list";
import withAuth from "@/components/with-auth";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


function AdminPage() {
    const { logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    }

    return (
        <div className="container py-12">
            <div className="flex justify-between items-center mb-12">
                <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl">Panel de Administración</h1>
                <Button onClick={handleLogout} variant="outline">
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                </Button>
            </div>
            
            <Tabs defaultValue="products">
                <div className="relative w-full overflow-x-auto">
                    <TabsList className="inline-flex items-center justify-start w-auto h-auto min-w-full p-1 space-x-1 bg-muted rounded-md">
                        <TabsTrigger value="banner">Gestionar Banner</TabsTrigger>
                        <TabsTrigger value="tiktok">Gestionar TikTok</TabsTrigger>
                        <TabsTrigger value="products">Gestionar Productos</TabsTrigger>
                        <TabsTrigger value="categories">Gestionar Categorías</TabsTrigger>
                        <TabsTrigger value="blog">Gestionar Blog</TabsTrigger>
                        <TabsTrigger value="testimonials">Gestionar Testimonios</TabsTrigger>
                        <TabsTrigger value="team">Gestionar Equipo</TabsTrigger>
                        <TabsTrigger value="metrics">Gestionar Métricas</TabsTrigger>
                        <TabsTrigger value="faq">Gestionar FAQ</TabsTrigger>
                    </TabsList>
                </div>
                 <TabsContent value="banner" className="mt-6">
                    <PromoBannerForm />
                </TabsContent>
                <TabsContent value="tiktok" className="mt-6">
                    <TiktokEmbedForm />
                </TabsContent>
                <TabsContent value="products" className="mt-6">
                    <ProductList />
                </TabsContent>
                <TabsContent value="categories" className="mt-6">
                    <CategoryList />
                </TabsContent>
                <TabsContent value="blog" className="mt-6">
                    <BlogPostList />
                </TabsContent>
                <TabsContent value="testimonials" className="mt-6">
                    <TestimonialList />
                </TabsContent>
                <TabsContent value="team" className="mt-6">
                    <TeamMemberList />
                </TabsContent>
                 <TabsContent value="metrics" className="mt-6">
                    <MetricList />
                </TabsContent>
                <TabsContent value="faq" className="mt-6">
                    <FaqList />
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default withAuth(AdminPage);
