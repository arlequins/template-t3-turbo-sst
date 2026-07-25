import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { BlogPost } from "~/lib/content";
import type { Locale } from "~/lib/i18n";
import { localizedPath, messages } from "~/lib/i18n";

export function PostCard(props: {
  locale: Locale;
  post: BlogPost;
  priority?: boolean;
}) {
  return (
    <article className="post-card">
      <Link
        aria-label={`${messages[props.locale].readArticle}: ${props.post.title}`}
        className="post-image-link"
        href={localizedPath(props.locale, `posts/${props.post.slug}`)}
      >
        <Image
          alt={props.post.imageAlt}
          fill
          priority={props.priority}
          sizes="(min-width: 900px) 50vw, 100vw"
          src={props.post.image}
        />
      </Link>
      <div className="post-card-body">
        <div className="post-meta">
          <span>{props.post.category}</span>
          <time dateTime={props.post.publishedAt}>
            {new Intl.DateTimeFormat(props.locale, {
              dateStyle: "medium",
            }).format(new Date(`${props.post.publishedAt}T00:00:00Z`))}
          </time>
        </div>
        <h2>
          <Link href={localizedPath(props.locale, `posts/${props.post.slug}`)}>
            {props.post.title}
          </Link>
        </h2>
        <p>{props.post.description}</p>
        <Link
          className="read-link"
          href={localizedPath(props.locale, `posts/${props.post.slug}`)}
        >
          {messages[props.locale].readArticle}
          <ArrowUpRight aria-hidden="true" size={17} />
        </Link>
      </div>
    </article>
  );
}
