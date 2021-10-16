import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {TransactionTypeEnum} from "../share/constain";

@Entity({name: 'bank_transaction'})
export class BankTransactionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 50, type: "varchar", nullable: false})
    date: string;

    @Column({length: 50, type: 'varchar', nullable: false})
    content: string;

    @Column({length: 50, type: 'varchar', nullable: false})
    amount: string;

    @Column({length: 50, type: 'varchar', nullable: false})
    type: TransactionTypeEnum;
}
