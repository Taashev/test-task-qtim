import { Options, Pagination, Relations } from '../types/repository';

export const defaultOptionRelations: Relations = { owner: false };

export const paginationDefaultOption: Pagination = {
  skip: 0,
  take: 0,
};

export const optionsDefault: Options = {
  ...defaultOptionRelations,
  ...paginationDefaultOption,
};
