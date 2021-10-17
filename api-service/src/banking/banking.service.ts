import {Inject, Injectable} from '@nestjs/common';
import {HelperService} from "../share/helper.service";
import {BankingTransactionModel} from "./models/banking-transaction.model";
import {IParseCSV, IRowInvalid} from './models/banking.interface';
import {MessagePatternEnum, SERVICE_NAME} from "../share/constain";
import {ClientProxy} from "@nestjs/microservices";
import {ConfigService} from "@nestjs/config";
import * as _ from 'lodash';
import {ImportTransactionRo} from "./models/import-transaction.ro";
import * as XLSX from 'xlsx';

@Injectable()
export class BankingService {
    constructor(
        @Inject(SERVICE_NAME) private readonly client: ClientProxy,
        private configService: ConfigService,
    ) {
    }

    /**
     * @description the method of emit the bank transactions to rabbitMq-transaction-service
     *
     * validate transaction and emit to rabbitMQ broker
     *
     * @param file
     *
     */
    async emitBankTransaction(file: Express.Multer.File): Promise<ImportTransactionRo> {
        const workbook = XLSX.read(file.buffer);
        const sheet = workbook.SheetNames;
        const dataRaw: Array<{date, content, amount, type}> = XLSX.utils.sheet_to_json(workbook.Sheets[sheet[0]]);
        const parsed = await this.validateTransactions(dataRaw);

        // TODO: its low performance. Solution: one loop to validate, divide and emit data

        const response = new ImportTransactionRo(parsed.listTransaction.length, parsed.listInvalid);
        if (parsed.listTransaction.length === 0) {
            return response;
        }
        const EMIT_TRANSACTION_DIVISION_SIZE = this.configService.get('EMIT_TRANSACTION_DIVISION_SIZE');
        const transChunks = _.chunk<BankingTransactionModel>(parsed.listTransaction, EMIT_TRANSACTION_DIVISION_SIZE);
        transChunks.forEach(transChuck => {
            this.emitTransactions(MessagePatternEnum.BANK_TRANSACTION, transChuck);
        });
        return response;
    }

    /**
     * @description emit the transactions to rabbitMq broker
     * @param patternName
     * @param transactions
     */
    protected async emitTransactions(patternName: string, transactions: Array<BankingTransactionModel>) {
        this.client.emit<IParseCSV, Array<BankingTransactionModel>>(
            MessagePatternEnum.BANK_TRANSACTION,
            transactions);
    }

    /**
     * @description validate transactions
     * @return IParseCSV
     * @param transaction
     */
    protected validateTransactions(transaction: Array<{date, content, amount, type}>) {
        const listTransaction: Array<BankingTransactionModel> = [];
        const listInvalid: IRowInvalid[] = [];
        transaction.forEach((item, index) => {
            if (HelperService.isValidDate(item.date)) {
                listInvalid.push({index, row: JSON.stringify(item)});
            } else if (HelperService.isValidType(item.type)) {
                listInvalid.push({index, row: JSON.stringify(item)});
            } else if(HelperService.isValidContent(item.content)) {
                listInvalid.push({index, row: JSON.stringify(item)});
            } else if (HelperService.isValidAmount(item.amount, item.type)) {
                listInvalid.push({index, row: JSON.stringify(item)});
            } else
            {
                const transactionModel: BankingTransactionModel = {
                    date: item.date,
                    content: item.content,
                    amount: item.amount,
                    type: item.type,
                    _idx: index,
                };
                listTransaction.push(transactionModel);
            }
            index = index + 1;
        });
        return {
            listTransaction,
            listInvalid,
        };
    }
}
