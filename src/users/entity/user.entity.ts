import {
  IsDate,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  @IsString()
  @IsUUID()
  id: string;

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;

  @Column({ type: 'varchar', length: 200, nullable: false, unique: true })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  username: string;

  @Column({ type: 'char', length: 60, nullable: false })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(60)
  password: string;
}
