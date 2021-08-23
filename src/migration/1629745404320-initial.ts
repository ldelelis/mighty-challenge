import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1629745404320 implements MigrationInterface {
    name = 'initial1629745404320'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "auth_user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_d7612de7c31d802a8346f412648" UNIQUE ("username"), CONSTRAINT "PK_9922406dc7d70e20423aeffadf3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "post" ("id" SERIAL NOT NULL, "description" character varying NOT NULL, "is_visible" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "authorId" integer, CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "post_image" ("id" SERIAL NOT NULL, "image" character varying NOT NULL, "caption" character varying NOT NULL, "order" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "postId" integer, CONSTRAINT "UQ_c94cd1b2b7338d2d73c51d68204" UNIQUE ("postId", "order"), CONSTRAINT "PK_0c74d0ac8869bc3a3cbaa3ec55d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "post_like" ("id" SERIAL NOT NULL, "postId" integer, "grammerId" integer, CONSTRAINT "UQ_246920d9ae6f39c18f6af1d25cc" UNIQUE ("postId", "grammerId"), CONSTRAINT "PK_0e95caa8a8b56d7797569cf5dc6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "grammer" ("id" SERIAL NOT NULL, "visible_name" character varying NOT NULL, "profile_picture" character varying NOT NULL, "auth_user_id" integer, CONSTRAINT "REL_9f31755f8c7bc3227879de8d37" UNIQUE ("auth_user_id"), CONSTRAINT "PK_b1c35b0014c52cc4eef6dcbd5a1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0" FOREIGN KEY ("authorId") REFERENCES "grammer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_image" ADD CONSTRAINT "FK_668c9fb892f2accb872670c7b1e" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_like" ADD CONSTRAINT "FK_789b3f929eb3d8760419f87c8a9" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_like" ADD CONSTRAINT "FK_e94dd5783db61c8f7872692dec1" FOREIGN KEY ("grammerId") REFERENCES "grammer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "grammer" ADD CONSTRAINT "FK_9f31755f8c7bc3227879de8d378" FOREIGN KEY ("auth_user_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "grammer" DROP CONSTRAINT "FK_9f31755f8c7bc3227879de8d378"`);
        await queryRunner.query(`ALTER TABLE "post_like" DROP CONSTRAINT "FK_e94dd5783db61c8f7872692dec1"`);
        await queryRunner.query(`ALTER TABLE "post_like" DROP CONSTRAINT "FK_789b3f929eb3d8760419f87c8a9"`);
        await queryRunner.query(`ALTER TABLE "post_image" DROP CONSTRAINT "FK_668c9fb892f2accb872670c7b1e"`);
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0"`);
        await queryRunner.query(`DROP TABLE "grammer"`);
        await queryRunner.query(`DROP TABLE "post_like"`);
        await queryRunner.query(`DROP TABLE "post_image"`);
        await queryRunner.query(`DROP TABLE "post"`);
        await queryRunner.query(`DROP TABLE "auth_user"`);
    }

}
