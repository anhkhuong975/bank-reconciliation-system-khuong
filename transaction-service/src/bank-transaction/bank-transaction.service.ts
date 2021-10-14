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
        const channel = context.getChannelRef();
        if (data === null || data === undefined || data.length === 0) {
            // TODO: handle error of type
            channel.ack(context.getMessage());
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
            Logger.log('>> COMMIT INSERTED');
        } catch {
            // TODO: handle error
            await queryRunner.rollbackTransaction();
            Logger.error('>> ROLLBACK INSERTED');
        } finally {
            await queryRunner.release();
            channel.ack(context.getMessage());
        }
    }
}
