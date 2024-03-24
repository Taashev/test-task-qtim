import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  IsDate,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { postConfig } from 'src/configs/post.config';
import { UserEntity } from 'src/users/entities/user.entity';

const { title, description } = postConfig;

@Entity({ name: 'posts' })
export class PostEntity {
  @IsString()
  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsString()
  @IsDate()
  @CreateDateColumn({ nullable: false })
  createdAt: Date;

  @IsString()
  @IsDate()
  @UpdateDateColumn({ nullable: false })
  updatedAt: Date;

  @IsNotEmpty()
  @IsString()
  @MinLength(title.minLength)
  @MaxLength(title.maxLength)
  @Column({ type: 'varchar', length: title.maxLength, nullable: false })
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(description.minLength)
  @MaxLength(description.maxLength)
  @Column({ type: 'varchar', length: description.maxLength, nullable: false })
  description: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => UserEntity)
  @ManyToOne(() => UserEntity, (user) => user.posts, { nullable: false })
  owner: UserEntity;
}
