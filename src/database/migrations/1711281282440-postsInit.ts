import { MigrationInterface, QueryRunner } from 'typeorm';

export class PostsInit1711281282440 implements MigrationInterface {
  name = 'PostsInit1711281282440';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying(100) NOT NULL, "description" character varying(2000) NOT NULL, "ownerId" uuid NOT NULL, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "FK_0e33434a2d18c89a149c8ad6d86" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "posts" DROP CONSTRAINT "FK_0e33434a2d18c89a149c8ad6d86"`,
    );
    await queryRunner.query(`DROP TABLE "posts"`);
  }
}
