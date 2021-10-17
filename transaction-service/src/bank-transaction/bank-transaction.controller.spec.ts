import { Test, TestingModule } from '@nestjs/testing';
import { BankTransactionController } from './bank-transaction.controller';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {ClientProxy, ClientsModule, Transport} from "@nestjs/microservices";
import {BankTransactionService} from "./bank-transaction.service";
import {SERVICE_NAME} from "../share/constain";

describe('BankTransactionController', () => {
  let controller: BankTransactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BankTransactionController],
      imports:[
        ConfigModule.forRoot(),
        ClientsModule.register([
          {
            name: '',
            transport: Transport.RMQ,
            options: {
              urls: [
                '',
              ],
              queue: '',
            },
          },
        ])],
      providers: [
        BankTransactionService,
        ConfigService,
        {
          provide: SERVICE_NAME,
          useValue: ClientProxy,
        }],
    }).compile();

    controller = module.get<BankTransactionController>(BankTransactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
