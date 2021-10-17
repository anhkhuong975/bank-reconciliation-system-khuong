import { Controller } from '@nestjs/common';
import {Ctx, MessagePattern, Payload, RmqContext} from "@nestjs/microservices";
import {BankTransactionService} from "./bank-transaction.service";
import {BankingTransactionModel} from "./bank-transaction.model";
import { MessagePatternEnum } from '../share/constain';

@Controller('bank-transaction')
export class BankTransactionController {
    constructor(
        private bankTransactionService: BankTransactionService,
    ) {
    }

    @MessagePattern(MessagePatternEnum.BANK_TRANSACTION)
    async handleBankTransaction(@Payload() data: Array<BankingTransactionModel>, @Ctx() context: RmqContext) {
        return this.bankTransactionService.importData(data, context);
    }
}
