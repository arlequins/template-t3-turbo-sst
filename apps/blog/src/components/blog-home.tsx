import Image from "next/image";

import { blogBrandConfig } from "~/config/brand.config";
import { listPublishedPosts } from "~/lib/content";
import type { Locale } from "~/lib/i18n";
import { messages } from "~/lib/i18n";

import { PostCard } from "./post-card";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export async function BlogHome(props: { locale: Locale }) {
  const posts = await listPublishedPosts(props.locale);
  const featuredPost = posts.find((post) => post.featured) ?? posts[0];

  return (
    <>
      <a className="skip-link" href="#content">
        {messages[props.locale].skipToContent}
      </a>
      <div className="hero-shell">
        <SiteHeader locale={props.locale} />
        <section className="hero">
          <Image
            alt=""
            className="hero-image"
            fill
            priority
            sizes="100vw"
            src={featuredPost?.image ?? "/blog/editorial-workspace.jpg"}
          />
          <div className="hero-shade" />
          <div className="hero-content">
            <p className="hero-kicker">
              {blogBrandConfig.collaborator
                ? `${messages[props.locale].collaboration} ${blogBrandConfig.collaborator}`
                : messages[props.locale].featured}
            </p>
            <h1>{blogBrandConfig.name}</h1>
            <p>{blogBrandConfig.description}</p>
          </div>
        </section>
      </div>
      <main id="content">
        <section className="writing-section" id="writing">
          <div className="section-heading">
            <p>{messages[props.locale].latest}</p>
            <h2>{messages[props.locale].allPosts}</h2>
          </div>
          <div className="post-grid">
            {posts.map((post, index) => (
              <PostCard
                key={post.slug}
                locale={props.locale}
                post={post}
                priority={index === 0}
              />
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
