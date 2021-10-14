import {ApiModelProperty} from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
import {IRowInvalid} from "./banking.interface";

export class ImportTransactionRo {
    constructor(listTransactionImporting: number,
                listInvalidFormat: Array<IRowInvalid>
                ) {
        this.countTransactionImporting = listTransactionImporting;
        this.listInvalidFormat = listInvalidFormat;
    }
    @ApiModelProperty({description: 'List invalid data of csv', type: Array<IRowInvalid>()})
    listInvalidFormat: Array<IRowInvalid>;

    @ApiModelProperty({description: 'List importing data of csv', type: Number})
    countTransactionImporting: number;
}