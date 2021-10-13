import {BankingTransactionModel} from "./banking-transaction.model";

export interface IParseCSV {
    listTransaction: Array<BankingTransactionModel>,
    listIndexInvalid: Array<IRowInvalid>,
}

export interface IRowInvalid {
    index: number,
    row: any,
}
