import { ArrowUpRight } from "lucide-react";

import { blogBrandConfig } from "~/config/brand.config";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <strong>{blogBrandConfig.name}</strong>
        <p>{blogBrandConfig.description}</p>
      </div>
      <div className="footer-links">
        <a href={`mailto:${blogBrandConfig.contact.email}`}>
          Email <ArrowUpRight aria-hidden="true" size={14} />
        </a>
        <a href={blogBrandConfig.contact.github}>
          GitHub <ArrowUpRight aria-hidden="true" size={14} />
        </a>
        <a href={blogBrandConfig.contact.linkedin}>
          LinkedIn <ArrowUpRight aria-hidden="true" size={14} />
        </a>
      </div>
    </footer>
  );
}
