import { MigrationInterface, QueryRunner } from 'typeorm';

export class PostsAlterColumnTileLength1711317041868
  implements MigrationInterface
{
  name = 'PostsAlterColumnTileLength1711317041868';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "posts" ALTER COLUMN "title" TYPE varchar(50)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "posts" ALTER COLUMN "title" TYPE varchar(100)`,
    );
  }
}
