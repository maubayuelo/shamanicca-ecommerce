import React from 'react';
import type { BlogGridItem } from './BlogGrid';

export type BlogMainArticleProps = {
  item: BlogGridItem;
  className?: string;
};

export default function BlogMainArticle({ item, className = '' }: BlogMainArticleProps) {
  return (
    <section className={`blog-main-article mb-lg-responsive ${className}`}>
      <a href={item.href || '#'} className="blog-main-article__thumb" aria-label={`Read ${item.title}`}>
        {/* large image, rely on CSS height */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.imageUrl || 'https://placehold.co/915x531.png'} alt="" />
      </a>
      <div className="blog-main-article__body">
        <h1 className="type-2xl type-extrabold m-0">
          <a href={item.href || '#'}>{item.title}</a>
        </h1>
        {item.summary && <p className="type-md m-0">{item.summary}</p>}
      </div>
    </section>
  );
}
