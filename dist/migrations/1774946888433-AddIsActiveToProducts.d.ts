import { MigrationInterface, QueryRunner } from "typeorm";
export declare class AddIsActiveToProducts1774946888433 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
