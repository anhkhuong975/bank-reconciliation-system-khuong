import {Inject, Injectable, Logger} from '@nestjs/common';
import {ClientProxy, RmqContext} from "@nestjs/microservices";
import {BankingTransactionModel} from "./bank-transaction.model";
import {getConnection} from "typeorm";
import {BankTransactionEntity} from "./bank-transaction.entity";
import {PATTERN_LOG, SERVICE_NAME} from "../share/constain";

@Injectable()
export class BankTransactionService {
    constructor(
        @Inject(SERVICE_NAME) private readonly client: ClientProxy,
    ) {
    }


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
            Logger.log(`>> COMMIT INSERTED. Index: [${data[0]._idx},${data[data.length - 1]._idx}]`);
            // this.emitLog('log emit');
        } catch (e) {
            await queryRunner.rollbackTransaction();
            Logger.error(`>> ROLLBACK ERROR. Index: [${data[0]._idx},${data[data.length - 1]._idx}]`);
            // TODO: handle error and write log
            // channel.nack(context.getMessage()); // No retry emit
            // this.emitLog('log emit');
        } finally {
            await queryRunner.release();
            channel.ack(context.getMessage());
            console.log('DONE progress rabbit data');
        }
    }

    /**
     * @description emit log data to rabbit broker
     */
    protected async emitLog(data: string) {
        this.client.emit<any, any>(PATTERN_LOG, data);
    }
}
