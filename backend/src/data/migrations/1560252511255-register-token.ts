import {MigrationInterface, QueryRunner} from "typeorm";

export class registerToken1560252511255 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "register_token" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, "company_id" integer NOT NULL, "expires" TIMESTAMP NOT NULL, CONSTRAINT "PK_b0b3cd81e7836b919b561dcbd5a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_a92c0558dac6fe05c0929823c0" ON "register_token" ("token") `);
        await queryRunner.query(`ALTER TABLE "register_token" ADD CONSTRAINT "FK_64b061a667a164a1a61be471ce2" FOREIGN KEY ("company_id") REFERENCES "company"("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "register_token" DROP CONSTRAINT "FK_64b061a667a164a1a61be471ce2"`);
        await queryRunner.query(`DROP INDEX "IDX_a92c0558dac6fe05c0929823c0"`);
        await queryRunner.query(`DROP TABLE "register_token"`);
    }

}
