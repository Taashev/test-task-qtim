import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { userConfig } from 'src/configs/user.config';
import { PostEntity } from 'src/posts/entities/post.entity';

const { username, password } = userConfig;

@Entity({ name: 'users' })
export class UserEntity {
  @IsString()
  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsDate()
  @CreateDateColumn()
  createdAt: Date;

  @IsDate()
  @UpdateDateColumn()
  updatedAt: Date;

  @IsNotEmpty()
  @IsString()
  @MinLength(username.minLength)
  @MaxLength(username.maxLength)
  @Column({
    type: 'varchar',
    length: username.maxLength,
    nullable: false,
    unique: true,
  })
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(password.minLength)
  @MaxLength(password.maxLength)
  @Column({ type: 'char', length: password.maxLength, nullable: false })
  password: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PostEntity)
  @OneToMany(() => PostEntity, (post) => post.owner, { cascade: true })
  posts: PostEntity[];
}
