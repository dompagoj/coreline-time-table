import {MigrationInterface, QueryRunner} from 'typeorm'
// tslint:disable:max-line-length

export class Initial1549741914272 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "project" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "avatar" character varying, "company_id" integer NOT NULL, "status" character varying NOT NULL, CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`)
        await queryRunner.query(`CREATE TABLE "hour" ("id" SERIAL NOT NULL, "amount" integer NOT NULL, "description" text, "user_id" integer NOT NULL, "date" date NOT NULL, "project_id" integer, CONSTRAINT "PK_76a16f0b13b939a84f90eee5368" PRIMARY KEY ("id"))`)
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying, "first_name" character varying, "last_name" character varying, "email" character varying NOT NULL, "type" character varying NOT NULL DEFAULT 'employee', "avatar" character varying, "company_id" integer NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`)
        await queryRunner.query(`CREATE TABLE "vote" ("id" SERIAL NOT NULL, "poll_id" integer, "voter_id" integer, "voted_for_id" integer, CONSTRAINT "REL_42b38d0987682f7057c0a9baf3" UNIQUE ("voted_for_id"), CONSTRAINT "PK_2d5932d46afe39c8176f9d4be72" PRIMARY KEY ("id"))`)
        await queryRunner.query(`CREATE TABLE "poll" ("id" SERIAL NOT NULL, "company_id" integer NOT NULL, "type" character varying NOT NULL, "start_date" TIMESTAMP NOT NULL, "end_date" TIMESTAMP NOT NULL, "active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_03b5cf19a7f562b231c3458527e" PRIMARY KEY ("id"))`)
        await queryRunner.query(`CREATE TABLE "company" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "auth_key" character varying NOT NULL, "domain" character varying NOT NULL, CONSTRAINT "UQ_a76c5cd486f7779bd9c319afd27" UNIQUE ("name"), CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"))`)
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_e207ffcc87db476eb97b3e0a0f2" FOREIGN KEY ("company_id") REFERENCES "company"("id")`)
        await queryRunner.query(`ALTER TABLE "hour" ADD CONSTRAINT "FK_1314520a8039738afe9a86ebf17" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE SET NULL`)
        await queryRunner.query(`ALTER TABLE "hour" ADD CONSTRAINT "FK_be814d1b076146d3761baf17a75" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE`)
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_9e70b5f9d7095018e86970c7874" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE CASCADE`)
        await queryRunner.query(`ALTER TABLE "vote" ADD CONSTRAINT "FK_0d7459852150cf964af26adcf63" FOREIGN KEY ("poll_id") REFERENCES "poll"("id") ON DELETE CASCADE`)
        await queryRunner.query(`ALTER TABLE "vote" ADD CONSTRAINT "FK_f5c90d8438424ec0f044ef945a9" FOREIGN KEY ("voter_id") REFERENCES "user"("id")`)
        await queryRunner.query(`ALTER TABLE "vote" ADD CONSTRAINT "FK_42b38d0987682f7057c0a9baf30" FOREIGN KEY ("voted_for_id") REFERENCES "user"("id")`)
        await queryRunner.query(`ALTER TABLE "poll" ADD CONSTRAINT "FK_beb0c4bee5977c1d88504ea42a8" FOREIGN KEY ("company_id") REFERENCES "company"("id")`)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "poll" DROP CONSTRAINT "FK_beb0c4bee5977c1d88504ea42a8"`)
        await queryRunner.query(`ALTER TABLE "vote" DROP CONSTRAINT "FK_42b38d0987682f7057c0a9baf30"`)
        await queryRunner.query(`ALTER TABLE "vote" DROP CONSTRAINT "FK_f5c90d8438424ec0f044ef945a9"`)
        await queryRunner.query(`ALTER TABLE "vote" DROP CONSTRAINT "FK_0d7459852150cf964af26adcf63"`)
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_9e70b5f9d7095018e86970c7874"`)
        await queryRunner.query(`ALTER TABLE "hour" DROP CONSTRAINT "FK_be814d1b076146d3761baf17a75"`)
        await queryRunner.query(`ALTER TABLE "hour" DROP CONSTRAINT "FK_1314520a8039738afe9a86ebf17"`)
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_e207ffcc87db476eb97b3e0a0f2"`)
        await queryRunner.query(`DROP TABLE "company"`)
        await queryRunner.query(`DROP TABLE "poll"`)
        await queryRunner.query(`DROP TABLE "vote"`)
        await queryRunner.query(`DROP TABLE "user"`)
        await queryRunner.query(`DROP TABLE "hour"`)
        await queryRunner.query(`DROP TABLE "project"`)
    }

}
