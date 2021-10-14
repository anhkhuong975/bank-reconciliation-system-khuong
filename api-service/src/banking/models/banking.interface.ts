import {BankingTransactionModel} from "./banking-transaction.model";

export interface IParseCSV {
    listTransaction: Array<BankingTransactionModel>,
    listInvalid: Array<IRowInvalid>,
}

export interface IRowInvalid {
    index: number,
    row: string,
}
