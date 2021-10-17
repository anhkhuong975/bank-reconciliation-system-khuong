import { Test, TestingModule } from '@nestjs/testing';
import { BankTransactionService } from './bank-transaction.service';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {ClientProxy, ClientsModule, Transport} from '@nestjs/microservices';
import {SERVICE_NAME} from "../share/constain";

describe('BankTransactionService', () => {
  let bankTransactionService: BankTransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    bankTransactionService = module.get<BankTransactionService>(BankTransactionService);
  });

  it('should be defined', () => {
    expect(bankTransactionService).toBeDefined();
  });
});
