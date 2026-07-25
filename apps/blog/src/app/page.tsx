import { BlogHome } from "~/components/blog-home";
import { blogBrandConfig } from "~/config/brand.config";

export default function HomePage() {
  return <BlogHome locale={blogBrandConfig.defaultLocale} />;
}
