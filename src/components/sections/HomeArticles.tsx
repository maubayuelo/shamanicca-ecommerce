import React from 'react';
import Image from 'next/image';

export type Article = {
  id: string | number;
  title: string;
  summary?: string;
  imageUrl?: string;
  href?: string;
};

type Props = {
  title?: string;
  articles: Article[];
  allArticlesHref?: string;
  className?: string;
};

export default function HomeArticles({
  title = 'Blog Articles',
  articles,
  allArticlesHref = '/blog',
  className = '',
}: Props) {
  return (
    <section className={`section-home-articles main  ${className}`}>
      <h2 className="section-title type-4xl type-extrabold mt-lg-responsive mb-md-responsive">{title}</h2>

      <div className="articles-grid">
        {articles.map((a) => (
          <ArticleCard key={a.id} article={a} />)
        )}
      </div>

      <div className="section-footer mt-lg-responsive mb-xl-responsive">
        <a href={allArticlesHref} className="btn btn-secondary btn-large">Check Shamanicca’s Blog Posts</a>
      </div>
    </section>
  );
}

function ArticleCard({ article }: { article: Article }) {
  const img = article.imageUrl || 'https://placehold.co/345x230';
  return (
    <article className="article-card">
      <a href={article.href || '#'} className="thumb" aria-label={`Read ${article.title}`}>
        <Image src={img} alt="" width={345} height={230} loading="lazy" />
      </a>
      <div className="info">
        <h3 className="type-2xl type-extrabold m-0"><a href={article.href || '#'}>{article.title}</a></h3>
        {article.summary && <p className="type-md m-0">{article.summary}</p>}
      </div>
    </article>
  );
}
