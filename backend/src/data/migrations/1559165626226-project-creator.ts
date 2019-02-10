import {MigrationInterface, QueryRunner} from "typeorm";

export class projectCreator1559165626226 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "project" ADD "creator_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_f1ed42d74cf7254df65da6f9fe0" FOREIGN KEY ("creator_id") REFERENCES "user"("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_f1ed42d74cf7254df65da6f9fe0"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "creator_id"`);
    }

}
