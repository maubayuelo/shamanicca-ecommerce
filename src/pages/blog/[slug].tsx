import Head from 'next/head';
import type { GetStaticPaths, GetStaticProps } from 'next';
import Header from '../../components/organisms/Header';
import Footer from '../../components/organisms/Footer';
import Image from 'next/image';
import Breadcrumb from '../../components/molecules/Breadcrumb';
import BlogGrid, { type BlogGridItem } from '../../components/sections/BlogGrid';
import BlogSidebar from '../../components/sections/BlogSidebar';
import BlogBanner from '../../components/sections/BlogBanner';
import ArticleShareIcons from '../../components/molecules/ArticleShareIcons';
import { getAllPosts, getPostBySlug, getPostsByCategory, type BlogPost } from '../../utils/blogPosts';

type PageProps = {
  post: BlogPost;
  relatedPosts: BlogGridItem[];
  sidebarSections: { title: string; items: BlogGridItem[] }[];
};

export default function BlogPostPage({ post, relatedPosts, sidebarSections }: PageProps) {
  const banners = [
    {
      imageUrl: 'https://placehold.co/270x270.png',
      title: 'Intentioned Apparel',
      subtitle: 'Wear your protection. Embody your abundance.',
      ctaLabel: 'SHOP NOW!',
      href: '/shop',
    },
  ];

  return (
    <>
      <Head>
        <title>{post.title} — Shamanicca</title>
      </Head>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 container mx-auto px-4 py-8">
          <Header />

          <div className="main">
            <div className="blog-layout mt-lg-responsive mb-xl-responsive">
              <div className="blog-content">

                <Breadcrumb
                  items={[
                    { label: 'Home', href: '/' },
                    { label: 'Blog', href: '/blog' },
                    { label: post.title },
                  ]}
                />

                <h1 className="type-5xl type-extrabold mt-xs-responsive mb-0">{post.title}</h1>
                
                {post.content && (
                    <>
                    <p className="type-2xl mt-sm-responsive mb-0">{post.content}</p>
                    </>
                    
                  )}
                {post.category && (
                  <div className="type-sm mb-xs-responsive mt-xs-responsive">
                    Category: <a href={`/blog/category/${encodeURIComponent(post.category)}`}>{post.category}</a>
                  </div>
                )}

                <ArticleShareIcons articleTitle={post.title} articleUrl={post.href} className="mt-xs-responsive  mb-md-responsive" />

                <article className="">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {post.imageUrl && (
                    <Image
                      src={post.imageUrl}
                      alt=""
                      width={915}
                      height={531}
                      className="mb-xxs-responsive rounded-30"
                      sizes="(min-width: 1280px) 915px, 100vw"
                      style={{ width: '100%', height: 'auto' }}
                      priority={false}
                    />
                  )}
                  {post.content && (
                    <>
                    <p className="type-paragraph type-medium">{post.content}</p>
                    </>
                    
                  )}
                  {/* Insert banner component here */}
                  {banners[0] && (
                    <div className="my-sm-responsive">
                      <BlogBanner
                        title={banners[0].title}
                        subtitle={banners[0].subtitle}
                        ctaLabel={banners[0].ctaLabel}
                        href={banners[0].href}
                        imageUrl={banners[0].imageUrl}
                        
                      />
                    </div>
                  )}

                  <iframe
                    className="post-video mt-md-responsive"
                    src="https://www.youtube.com/embed/BhBFiESIA8E?si=MtQTF1dWnaKp70UL"
                    title="YouTube video player"
                    frameBorder={0}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />

                  {post.content && (
                    <>
                    <p className="type-italic type-sm">{post.content}</p>
                    </>
                    
                  )}


                  {post.content && (
                    <>
                    <p className="type-paragraph type-medium">{post.content}</p>
                    <p className="type-paragraph type-medium">{post.content}</p>
                    <p className="type-paragraph type-medium">{post.content}</p>
                    </>
                    
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {post.imageUrl && (
                    <Image
                      src={post.imageUrl}
                      alt=""
                      width={915}
                      height={531}
                      className="mb-xxs-responsive rounded-30"
                      sizes="(min-width: 1280px) 915px, 100vw"
                      style={{ width: '100%', height: 'auto' }}
                      priority={false}
                    />
                  )}
                  {post.content && (
                    <>
                    <p className="type-italic type-sm">{post.content}</p>
                    </>
                    
                  )}
                  {post.content && (
                    <>
                    <p className="type-paragraph type-medium">{post.content}</p>
                    <p className="type-paragraph type-medium">{post.content}</p>
                    <p className="type-paragraph type-medium">{post.content}</p>
                    </>
                    
                  )}
                  {banners[0] && (
                    <div className="my-sm-responsive">
                      <BlogBanner
                        title={banners[0].title}
                        subtitle={banners[0].subtitle}
                        ctaLabel={banners[0].ctaLabel}
                        href={banners[0].href}
                        imageUrl={banners[0].imageUrl}
                        isAffilliated={true}
                      />
                    </div>
                  )}
                </article>

                {relatedPosts.length > 0 && (
                  <BlogGrid title="Related Posts" items={relatedPosts} />
                )}
              </div>

              <BlogSidebar sections={sidebarSections} banners={banners} />
            </div>
          </div>

          <Footer />
        </main>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getAllPosts();
  const paths = posts
    .map((p) => p.href?.split('/').pop())
    .filter((s): s is string => Boolean(s))
    .map((slug) => ({ params: { slug } }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<PageProps> = async (ctx) => {
  const slug = ctx.params?.slug as string;
  const post = getPostBySlug(slug);

  if (!post) {
    return { notFound: true };
  }

  const sameCategory = post.category ? getPostsByCategory(post.category) : [];
  const relatedPosts = (sameCategory.length > 0 ? sameCategory : getAllPosts())
    .filter((p) => p.href !== post.href)
    .slice(0, 6);

  const others = getAllPosts().filter((p) => p.href !== post.href);
  const sidebarSections = [
    { title: 'Top Reads', items: others.slice(0, 3) },
    { title: 'Discover More', items: others.slice(3, 6) },
  ];

  return {
    props: {
      post,
      relatedPosts,
      sidebarSections,
    },
  };
};
