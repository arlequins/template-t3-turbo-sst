export const ContentCategory = {
  DESIGN: "design",
  ENGINEERING: "engineering",
  NOTES: "notes",
} as const;
export type ContentCategory =
  (typeof ContentCategory)[keyof typeof ContentCategory];

export const ContentLocale = {
  EN: "en",
  JA: "ja",
  KO: "ko",
} as const;
export type ContentLocale = (typeof ContentLocale)[keyof typeof ContentLocale];

export const ContentStatus = {
  APPROVED: "approved",
  DRAFT: "draft",
  IN_REVIEW: "in-review",
} as const;
export type ContentStatus = (typeof ContentStatus)[keyof typeof ContentStatus];

export type ContentInput = {
  category: ContentCategory;
  content: string;
  description: string;
  featured: boolean;
  image: string;
  imageAlt: string;
  locale: ContentLocale;
  publishedAt: Date | null;
  slug: string;
  status: ContentStatus;
  title: string;
  translationKey: string;
};

export type ContentRecord = {
  createdAt: Date;
  id: string;
  updatedAt: Date | null;
  version: number;
} & ContentInput;

export type ContentListInput = {
  direction?: "asc" | "desc";
  page?: number;
  pageSize?: number;
  query?: string;
  sort?: "createdAt" | "title";
  status?: ContentStatus;
  locale?: ContentLocale;
};

export type NormalizedContentListInput = Required<
  Omit<ContentListInput, "locale" | "status">
> &
  Pick<ContentListInput, "locale" | "status">;

export type ContentPage = {
  items: ContentRecord[];
  page: number;
  pageSize: number;
  total: number;
};
