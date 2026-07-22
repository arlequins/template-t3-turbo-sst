export type ContentRecord = {
  content: string;
  createdAt: Date;
  id: string;
  title: string;
  updatedAt: Date | null;
};

export type ContentListInput = {
  direction?: "asc" | "desc";
  page?: number;
  pageSize?: number;
  query?: string;
  sort?: "createdAt" | "title";
};

export type ContentPage = {
  items: ContentRecord[];
  page: number;
  pageSize: number;
  total: number;
};
