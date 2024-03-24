export type Relations = { owner?: boolean };

export type Pagination = { skip?: number; take?: number };

export type Options = Relations & Pagination;
