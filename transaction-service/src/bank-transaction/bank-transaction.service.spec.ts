import { Test, TestingModule } from '@nestjs/testing';
import { BankTransactionService } from './bank-transaction.service';

describe('BankTransactionService', () => {
  let bankTransactionService: BankTransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BankTransactionService],
    }).compile();

    bankTransactionService = module.get<BankTransactionService>(BankTransactionService);
  });

  it('should be defined', () => {
    expect(bankTransactionService).toBeDefined();
  });
});
