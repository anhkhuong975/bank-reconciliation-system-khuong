import {ApiModelProperty} from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
import {IRowInvalid} from "./banking.interface";
import {BankingTransactionModel} from "./banking-transaction.model";

export class ImportTransactionRo {
    constructor(listTransactionImporting: Array<BankingTransactionModel>,
                listInvalid: Array<IRowInvalid>
                ) {
        this.listTransactionImporting = listTransactionImporting;
        this.listInvalid = listInvalid;
    }
    @ApiModelProperty({description: 'List invalid data of csv', type: Array<IRowInvalid>()})
    listInvalid: Array<IRowInvalid>;

    @ApiModelProperty({description: 'List importing data of csv', type: Array<BankingTransactionModel>()})
    listTransactionImporting: Array<BankingTransactionModel>;
}