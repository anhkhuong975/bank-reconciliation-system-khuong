import {TransactionTypeEnum} from "../share/constain";

export class BankingTransactionModel {
    date: string;
    content: string;
    amount: string;
    type: TransactionTypeEnum;
}
