import { Test, TestingModule } from '@nestjs/testing';
import { BankTransactionController } from './bank-transaction.controller';

describe('BankTransactionController', () => {
  let controller: BankTransactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BankTransactionController],
    }).compile();

    controller = module.get<BankTransactionController>(BankTransactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
