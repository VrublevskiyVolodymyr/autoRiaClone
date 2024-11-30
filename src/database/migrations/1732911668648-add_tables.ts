import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTables1732911668648 implements MigrationInterface {
    name = 'AddTables1732911668648'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "action_tokens" ("created" TIMESTAMP(0) NOT NULL DEFAULT now(), "updated" TIMESTAMP(0) NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "actionToken" text NOT NULL, "device_id" text NOT NULL, "type" text NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_d29a2a18dc1b6b8abe2a151bea0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_56d8cf4bf12477d3b08ff24343" ON "action_tokens" ("device_id") `);
        await queryRunner.query(`CREATE TABLE "view" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "advertisement_id" character varying NOT NULL, "view_date" date NOT NULL, "viewer_user_id" character varying NOT NULL, "is_owner" boolean NOT NULL, "is_admin" boolean NOT NULL, "advertisementId" uuid, CONSTRAINT "PK_86cfb9e426c77d60b900fe2b543" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cars" ("created" TIMESTAMP(0) NOT NULL DEFAULT now(), "updated" TIMESTAMP(0) NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "producer" text NOT NULL, "model" text NOT NULL, "power" text NOT NULL, "year" text NOT NULL, "color" text NOT NULL, "mileage" text NOT NULL, "numberDoors" text NOT NULL, "numberSeats" text NOT NULL, "photos" text array, "user_id" uuid NOT NULL, CONSTRAINT "PK_fc218aa84e79b477d55322271b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "price-car" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "UAH" numeric(10,2) NOT NULL, "USD" numeric(10,2) NOT NULL, "EUR" numeric(10,2) NOT NULL, CONSTRAINT "PK_7c2ecdee53bcb7427dc78b437fc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."advertisement_currency_enum" AS ENUM('UAH', 'USD', 'EUR')`);
        await queryRunner.query(`CREATE TABLE "advertisement" ("created" TIMESTAMP(0) NOT NULL DEFAULT now(), "updated" TIMESTAMP(0) NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, "views" integer NOT NULL DEFAULT '0', "status" boolean NOT NULL DEFAULT true, "region" character varying NOT NULL, "price" numeric(10,2) NOT NULL, "currency" "public"."advertisement_currency_enum" NOT NULL, "user_id" character varying NOT NULL, "editCount" integer NOT NULL DEFAULT '0', "car_id" uuid, "priceCarId" uuid, "userId" uuid, CONSTRAINT "REL_e509f545e97e372b662eb5b8bf" UNIQUE ("car_id"), CONSTRAINT "REL_d7aa907ae5ca968c565dfd5d34" UNIQUE ("priceCarId"), CONSTRAINT "PK_c8486834e5ef704ec05b7564d89" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "dealerships" ("created" TIMESTAMP(0) NOT NULL DEFAULT now(), "updated" TIMESTAMP(0) NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "location" character varying NOT NULL, CONSTRAINT "PK_d0437fe70985654646502a6c805" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "old_password" ("created" TIMESTAMP(0) NOT NULL DEFAULT now(), "updated" TIMESTAMP(0) NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "password" text NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_d7b9384baaa44362755f5aba469" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "refresh_tokens" ("created" TIMESTAMP(0) NOT NULL DEFAULT now(), "updated" TIMESTAMP(0) NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "refreshToken" text NOT NULL, "device_id" text NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_443e94ab8ae68be5d2beb2b811" ON "refresh_tokens" ("device_id") `);
        await queryRunner.query(`CREATE TYPE "public"."users_roles_enum" AS ENUM('buyer', 'seller', 'manager', 'admin', 'mechanic', 'dealership-admin', 'dealership-manager', 'dealership-seller', 'dealership-mechanic')`);
        await queryRunner.query(`CREATE TYPE "public"."users_accounttype_enum" AS ENUM('basic', 'premium')`);
        await queryRunner.query(`CREATE TABLE "users" ("created" TIMESTAMP(0) NOT NULL DEFAULT now(), "updated" TIMESTAMP(0) NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" text NOT NULL, "lastName" text NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "device_id" text NOT NULL, "phone" text, "image" text, "roles" "public"."users_roles_enum" array NOT NULL, "accountType" "public"."users_accounttype_enum" NOT NULL DEFAULT 'basic', "is_verified" boolean NOT NULL DEFAULT false, "is_active" boolean NOT NULL DEFAULT false, "countOfAds" integer, "dealership_id" uuid, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_69c064f0f99e36e4e44c702d673" UNIQUE ("device_id"), CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "regions" ("created" TIMESTAMP(0) NOT NULL DEFAULT now(), "updated" TIMESTAMP(0) NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "region" text NOT NULL, CONSTRAINT "PK_4fcd12ed6a046276e2deb08801c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "models" ("created" TIMESTAMP(0) NOT NULL DEFAULT now(), "updated" TIMESTAMP(0) NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "model" character varying NOT NULL, "producer_id" uuid NOT NULL, CONSTRAINT "PK_ef9ed7160ea69013636466bf2d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "producers" ("created" TIMESTAMP(0) NOT NULL DEFAULT now(), "updated" TIMESTAMP(0) NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "producer" character varying NOT NULL, CONSTRAINT "UQ_3b38383d02c4a9cfa8b3371b9dd" UNIQUE ("producer"), CONSTRAINT "PK_7f16886d1a44ed0974232b82506" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "premium" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "orderId" character varying NOT NULL, "userId" uuid, CONSTRAINT "REL_582dbb9e7a76251281b653602a" UNIQUE ("userId"), CONSTRAINT "PK_111eb81823538c77bcb9e4e0cab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "currency_privatbank" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ccy" character varying(10) NOT NULL, "base_ccy" character varying(10) NOT NULL DEFAULT 'UAH', "buy" numeric(10,2) NOT NULL, "sale" numeric(10,2) NOT NULL, CONSTRAINT "PK_49c92c4c3a327fd695e011df1a7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "action_tokens" ADD CONSTRAINT "FK_e9a3f1f8966f1cae54c487c0eb4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "view" ADD CONSTRAINT "FK_53ff7dacfd88f0cbc413c07a68d" FOREIGN KEY ("advertisementId") REFERENCES "advertisement"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cars" ADD CONSTRAINT "FK_673bd295e52580c0fb09d0fbbb8" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "advertisement" ADD CONSTRAINT "FK_e509f545e97e372b662eb5b8bf7" FOREIGN KEY ("car_id") REFERENCES "cars"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "advertisement" ADD CONSTRAINT "FK_d7aa907ae5ca968c565dfd5d340" FOREIGN KEY ("priceCarId") REFERENCES "price-car"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "advertisement" ADD CONSTRAINT "FK_6ec9d86e7c48126869b4c7f22db" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "old_password" ADD CONSTRAINT "FK_06db344cfb5c8410811034e9dc8" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_e55a019c00e72ac8b9e13d6f2fd" FOREIGN KEY ("dealership_id") REFERENCES "dealerships"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "models" ADD CONSTRAINT "FK_7263d22371975408d1ca5590f51" FOREIGN KEY ("producer_id") REFERENCES "producers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "premium" ADD CONSTRAINT "FK_582dbb9e7a76251281b653602aa" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "premium" DROP CONSTRAINT "FK_582dbb9e7a76251281b653602aa"`);
        await queryRunner.query(`ALTER TABLE "models" DROP CONSTRAINT "FK_7263d22371975408d1ca5590f51"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_e55a019c00e72ac8b9e13d6f2fd"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4"`);
        await queryRunner.query(`ALTER TABLE "old_password" DROP CONSTRAINT "FK_06db344cfb5c8410811034e9dc8"`);
        await queryRunner.query(`ALTER TABLE "advertisement" DROP CONSTRAINT "FK_6ec9d86e7c48126869b4c7f22db"`);
        await queryRunner.query(`ALTER TABLE "advertisement" DROP CONSTRAINT "FK_d7aa907ae5ca968c565dfd5d340"`);
        await queryRunner.query(`ALTER TABLE "advertisement" DROP CONSTRAINT "FK_e509f545e97e372b662eb5b8bf7"`);
        await queryRunner.query(`ALTER TABLE "cars" DROP CONSTRAINT "FK_673bd295e52580c0fb09d0fbbb8"`);
        await queryRunner.query(`ALTER TABLE "view" DROP CONSTRAINT "FK_53ff7dacfd88f0cbc413c07a68d"`);
        await queryRunner.query(`ALTER TABLE "action_tokens" DROP CONSTRAINT "FK_e9a3f1f8966f1cae54c487c0eb4"`);
        await queryRunner.query(`DROP TABLE "currency_privatbank"`);
        await queryRunner.query(`DROP TABLE "premium"`);
        await queryRunner.query(`DROP TABLE "producers"`);
        await queryRunner.query(`DROP TABLE "models"`);
        await queryRunner.query(`DROP TABLE "regions"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_accounttype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_roles_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_443e94ab8ae68be5d2beb2b811"`);
        await queryRunner.query(`DROP TABLE "refresh_tokens"`);
        await queryRunner.query(`DROP TABLE "old_password"`);
        await queryRunner.query(`DROP TABLE "dealerships"`);
        await queryRunner.query(`DROP TABLE "advertisement"`);
        await queryRunner.query(`DROP TYPE "public"."advertisement_currency_enum"`);
        await queryRunner.query(`DROP TABLE "price-car"`);
        await queryRunner.query(`DROP TABLE "cars"`);
        await queryRunner.query(`DROP TABLE "view"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_56d8cf4bf12477d3b08ff24343"`);
        await queryRunner.query(`DROP TABLE "action_tokens"`);
    }

}
