import { Test, TestingModule } from '@nestjs/testing';
import { BankingService } from './banking.service';
import {ValidateFilePipe} from "../share/validate-file.pipe";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {ClientProxy, ClientsModule, Transport} from "@nestjs/microservices";
import {SERVICE_NAME} from "../share/constain";
import {BadRequestException} from "@nestjs/common";
import {ImportTransactionRo} from "./models/import-transaction.ro";
import * as fs from "fs";

const TS_MOCK = {
  "listTransaction": [
    {
      "date": "21/03/2020 10:20:11",
      "content": "Any text there",
      "amount": "100.00",
      "type": "Deposit"
    },
    {
      "date": "21/03/2020 10:20:13",
      "content": "Any text there",
      "amount": "-100.002",
      "type": "Withdraw"
    }
  ],
  "listInvalid": [
    {
      "index": 2,
      "row": "21/03/2020 10:20:12,Any text there,100.001,Deposit-fx"
    },
    {
      "index": 4,
      "row": "21/03/2020 10:20:13,Any text there,-100.002,Withdraw-wr"
    },
    {
      "index": 5,
      "row": "21/03/2020 10:20:1200,Any text there,100.001,Deposit"
    }
  ]
};

describe('PipeTransform File', () => {
  const pipe = new ValidateFilePipe();

  it('Should be return file value', () => {
    const file = {mimetype: 'text/csv'} as Express.Multer.File;
    expect(pipe.transform(file, {} as any)).toBe(file);
  });

  // it('Should be...',  async () => {
  //   const file = {mimetype: '53122222MM 49 js'} as Express.Multer.File;
  //   await expect(pipe.transform(file, {} as any)).rejects.toThrow(BadRequestException);
  // });
});

describe('BankingService', () => {
  let bankingService: BankingService;

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
        BankingService,
        ConfigService,
        {
          provide: SERVICE_NAME,
          useValue: ClientProxy,
        }],
    }).compile();
    bankingService = module.get<BankingService>(BankingService);
  });

  it('should be defined', () => {
    expect(bankingService).toBeDefined();
  });

  it('should be throw exception with invalid header',   async () => {
    jest.spyOn<any, any>(bankingService, 'parseCSV')
        .mockImplementation(() => Promise.resolve({listInvalid: [{index: 0}]}));
    const temp = bankingService.emitBankTransaction({} as any);
    await expect(temp).rejects.toThrow(BadRequestException);
  });

  it('should be return if listTransaction null',   async () => {
    jest.spyOn<any, any>(bankingService, 'parseCSV')
        .mockImplementation(() => Promise.resolve({listInvalid: [], listTransaction: []}));
    const response = new ImportTransactionRo(0, []);
    const temp = await bankingService.emitBankTransaction({} as any);
    await expect(temp).toEqual(response);
  });

  it('validate  of the csv file',   async () => {
    const file: any = {};
    file.buffer = fs.readFileSync(__dirname + '/../../test-resources/test-for-type.csv');
    const serviceProto = Object.getPrototypeOf(bankingService);
    const temp = await serviceProto.parseCSV(file as any);
    expect(temp).toEqual(TS_MOCK);
  });
});
