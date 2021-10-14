import { Module } from '@nestjs/common';
import { BankingService } from './banking.service';
import { BankingController } from './banking.controller';
import {ClientsModule, Transport} from "@nestjs/microservices";
import {SERVICE_NAME} from "../share/constain";
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: SERVICE_NAME,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_HOST],
          queue: process.env.QUEUE,
          queueOptions: {
            durable: false
          },
        }
      },
    ]),
  ],
  providers: [BankingService],
  controllers: [BankingController],
  exports: [BankingService]
})
export class BankingModule {}
