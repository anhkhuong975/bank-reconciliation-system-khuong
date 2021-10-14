import { Injectable } from '@nestjs/common';
import {RmqContext} from "@nestjs/microservices";
import {BankingTransactionModel} from "./bank-transaction.model";

@Injectable()
export class BankTransactionService {


    /**
     * @description import data from rabbitMq
     */
    async importData(data: BankingTransactionModel, context: RmqContext) {
        const channel = context.getChannelRef();
        const originMessage = context.getMessage();
        await new Promise(resolve => {
            setTimeout(() => {
                console.log(data);
                resolve(data);
            }, 5000)
        });
        channel.ack(originMessage);
    }
}
