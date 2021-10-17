import { Test, TestingModule } from '@nestjs/testing';
import { BankingController } from './banking.controller';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {ClientProxy, ClientsModule, Transport} from "@nestjs/microservices";
import {BankingService} from "./banking.service";
import {SERVICE_NAME} from "../share/constain";

describe('BankingController', () => {
  let controller: BankingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BankingController],
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
        BankingService,
        ConfigService,
        {
          provide: SERVICE_NAME,
          useValue: ClientProxy,
        }],
    }).compile();

    controller = module.get<BankingController>(BankingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
