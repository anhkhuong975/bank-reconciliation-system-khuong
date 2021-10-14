import { Module } from '@nestjs/common';
import { BankTransactionService } from './bank-transaction.service';
import { BankTransactionController } from './bank-transaction.controller';

@Module({
  providers: [BankTransactionService],
  controllers: [BankTransactionController]
})
export class BankTransactionModule {}
