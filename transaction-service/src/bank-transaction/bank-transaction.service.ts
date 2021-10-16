import {Injectable, Logger} from '@nestjs/common';
import {RmqContext} from "@nestjs/microservices";
import {BankingTransactionModel} from "./bank-transaction.model";
import {getConnection} from "typeorm";
import {BankTransactionEntity} from "./bank-transaction.entity";

@Injectable()
export class BankTransactionService {


    /**
     * @description import data from rabbitMq
     *
     * insert the data of rabbitMq into database
     *
     * after the the validate pipe of api-service, the data of rabbit broker was validated and cleaned
     *
     */
    async importData(data: Array<BankingTransactionModel>, context: RmqContext) {
        console.log('START progress the rabbit data');
        const channel = context.getChannelRef();
        if (data === null || data === undefined) {
            // TODO: handle error of type and write log
            console.error('>> ERROR: the data undefined');
            channel.ack(context.getMessage());
            console.log('DONE progress rabbit data');
            return ;
        }
        if (data.length === 0) {
            console.error('>> WARN: array data null');
            console.log('DONE progress rabbit data');
            return ;
        }
        const queryRunner = getConnection().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const bankTransactionEntities: BankTransactionEntity[] = [];
            data.forEach(item => {
                const bankTransactionEntity = new BankTransactionEntity();
                bankTransactionEntity.type = item.type;
                bankTransactionEntity.content = item.content;
                bankTransactionEntity.amount = item.amount;
                bankTransactionEntity.date = item.date;
                bankTransactionEntities.push(bankTransactionEntity);
            });
            await queryRunner.manager.createQueryBuilder()
                .insert()
                .into(BankTransactionEntity)
                .values(bankTransactionEntities)
                .execute();
            await queryRunner.commitTransaction();
            channel.ack(context.getMessage());
            Logger.log(`>> COMMIT INSERTED. Index: [${data[0]._idx},${data[data.length - 1]._idx}]`);
        } catch {
            // TODO: handle error and write log
            await queryRunner.rollbackTransaction();
            channel.nack(context.getMessage());
            Logger.error(`>> ROLLBACK ERROR. Index: [${data[0]._idx},${data[data.length - 1]._idx}]`);
        } finally {
            await queryRunner.release();
            console.log('DONE progress rabbit data');
        }
    }
}
