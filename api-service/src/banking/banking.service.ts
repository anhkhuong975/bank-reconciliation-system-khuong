import {Injectable} from '@nestjs/common';
import * as csv from 'csv-parse';
import {HelperService} from "../share/helper.service";
import {BankingTransactionModel} from "./banking-transaction.model";
import {IParseCSV, IRowInvalid} from './banking.interface';

@Injectable()
export class BankingService {

    /**
     * @description the method of import bank transaction
     *
     * validate transaction and emit to rabbitMQ broker
     *
     * @param file
     *
     */
    async importBankTransaction(file: Express.Multer.File) {
        const parsed = await this.parseCSV(file);
        console.log(parsed);
        return parsed;
    }

    /**
     * @description the method to parse csv file to array
     * @param file
     * @return IParseCSV
     */
    protected async parseCSV(file: Express.Multer.File): Promise<IParseCSV> {
        const listTransaction: Array<BankingTransactionModel> = [];
        const listInvalid: IRowInvalid[] = [];
        const parsePromise = new Promise<IParseCSV>((resolve) => {
            let index: number = 0;
            HelperService.bufferToStream(file.buffer)
                .pipe(csv())
                .on('data', (item) => {
                    if (index === 0) {
                        if (HelperService.isValidHeaderCSV(item)) {
                            listInvalid.push({index, row: item});
                        }
                    } else if (HelperService.isValidRow(item)) {
                        listInvalid.push({index, row: item});
                    } else if (HelperService.isValidDate(item[0])) {
                        listInvalid.push({index, row: item});
                    } else if (HelperService.isValidType(item[3])) {
                        listInvalid.push({index, row: item});
                    } else {
                        const transactionModel: BankingTransactionModel = {
                            date: item[0],
                            content: item[1],
                            amount: item[2],
                            type: item[3],
                        };
                        listTransaction.push(transactionModel);
                    }
                    index = index + 1;
                })
                .on('end',function(){
                    resolve({
                        listTransaction,
                        listInvalid,
                    })
                });
        });
        return await parsePromise;
    }
}
