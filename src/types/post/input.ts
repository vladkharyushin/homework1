export type PostParams = {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
};

export type UpdatePostData = {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
};

export type InputPostType = {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
};

export type PostSortDataType = {
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    sortDirection?: "asc" | "desc";
    postId?: string;
};