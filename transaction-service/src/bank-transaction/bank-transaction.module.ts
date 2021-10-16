import { Module } from '@nestjs/common';
import { BankTransactionService } from './bank-transaction.service';
import { BankTransactionController } from './bank-transaction.controller';
import {ClientsModule, Transport} from '@nestjs/microservices';
import {SERVICE_NAME} from "../share/constain";
import {ConfigModule, ConfigService} from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.registerAsync([{
      name: SERVICE_NAME,
      imports:[ConfigModule],
      useFactory: (configService: ConfigService) => ({
        name: SERVICE_NAME,
        transport: Transport.RMQ,
        options: {
          urls: [configService.get('RABBITMQ_HOST').toString()],
          queue: configService.get('QUEUE_LOG'),
          queueOptions: {
            durable: false
          },
        }
      }),
      inject: [ConfigService]
    }])
  ],
  providers: [BankTransactionService],
  controllers: [BankTransactionController]
})
export class BankTransactionModule {}
