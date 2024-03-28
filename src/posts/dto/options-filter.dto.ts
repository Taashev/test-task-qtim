import { IntersectionType } from '@nestjs/mapped-types';

import { PostsPaginationDto } from './posts-pagination.dto';
import { PostsFilterDto } from './posts-filter.dto';

export class OptionsFilterDto extends IntersectionType(
  PostsPaginationDto,
  PostsFilterDto,
) {}
