import { Test, TestingModule } from '@nestjs/testing';
import { BankingService } from './banking.service';
import {ValidateFilePipe} from "../share/validate-file.pipe";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {ClientProxy, ClientsModule, Transport} from "@nestjs/microservices";
import {SERVICE_NAME} from "../share/constain";
import {ImportTransactionRo} from "./models/import-transaction.ro";
import * as fs from "fs";

const MOCK_VLD_EX =
    {
      "listTransaction": [
        {
          "date": "21/03/2020 10:20:11",
          "content": "it is content",
          "amount": "+300.000",
          "type": "Deposit",
          "_idx": 0
        },
        {
          "date": "21/03/2020 10:20:11",
          "content": "it is content",
          "amount": "-300.000",
          "type": "Withdraw",
          "_idx": 5
        }
      ],
      "listInvalid": [
        {
          "index": 1,
          "row": "{\"date\":\"2100/03/2020 10:20:11\",\"content\":\"it is content\",\"amount\":\"+300.000\",\"type\":\"Deposit\"}"
        },
        {
          "index": 2,
          "row": "{\"date\":\"21/03/2020 10:20:11\",\"content\":\"it is content\",\"amount\":\"-300.000\",\"type\":\"Deposit\"}"
        },
        {
          "index": 3,
          "row": "{\"date\":\"21/03/2020 10:20:11\",\"content\":\"it is content\",\"amount\":\"+300.000\",\"type\":\"Deposit-wrong\"}"
        },
        {
          "index": 4,
          "row": "{\"date\":\"21/03/2020 10:20:11\",\"content\":\"it is content\",\"amount\":\"+300.000wrong\",\"type\":\"Deposit\"}"
        }
      ]
    };

const MOCK_VLD_IN: Array<{date, content, amount, type}> = [
  {
    date: '21/03/2020 10:20:11',
    content: 'it is content',
    amount: '+300.000',
    type: 'Deposit'
  },
  {
    date: '2100/03/2020 10:20:11',
    content: 'it is content',
    amount: '+300.000',
    type: 'Deposit'
  },
  {
    date: '21/03/2020 10:20:11',
    content: 'it is content',
    amount: '-300.000',
    type: 'Deposit'
  },
  {
    date: '21/03/2020 10:20:11',
    content: 'it is content',
    amount: '+300.000',
    type: 'Deposit-wrong'
  },
  {
    date: '21/03/2020 10:20:11',
    content: 'it is content',
    amount: '+300.000wrong',
    type: 'Deposit'
  },
  {
    date: '21/03/2020 10:20:11',
    content: 'it is content',
    amount: '-300.000',
    type: 'Withdraw'
  }
];

describe('PipeTransform File', () => {
  const pipe = new ValidateFilePipe();

  it('Should be return file value', () => {
    const file = {mimetype: 'text/csv'} as Express.Multer.File;
    expect(pipe.transform(file, {} as any)).toBe(file);
  });

  it('Should be return file value', () => {
    const file = {mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'} as Express.Multer.File;
    expect(pipe.transform(file, {} as any)).toBe(file);
  });

  // it('Should be...',  async () => {
  //   const file = {mimetype: 'js'} as Express.Multer.File;
  //   await expect(pipe.transform(file, {} as any)).toThrowError();
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

  it('should be return if listTransaction null',   async () => {
    jest.spyOn<any, any>(bankingService, 'validateTransactions')
        .mockImplementation(() => Promise.resolve({listInvalid: [], listTransaction: []}));
    const response = new ImportTransactionRo(0, []);
    const file: any = {};
    file.buffer = fs.readFileSync(__dirname + '/../../test-resources/test-for-type.csv');
    const temp = await bankingService.emitBankTransaction(file as Express.Multer.File);
    await expect(temp).toEqual(response);
  });

  it('validate  of the csv file',   async () => {
    const file: any = {};
    file.buffer = fs.readFileSync(__dirname + '/../../test-resources/test-for-type.csv');
    const serviceProto = Object.getPrototypeOf(bankingService);
    const temp = await serviceProto.validateTransactions(MOCK_VLD_IN);
    expect(temp).toEqual(MOCK_VLD_EX);
  });
});
