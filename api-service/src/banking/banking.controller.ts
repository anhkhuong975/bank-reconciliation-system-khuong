import {Controller, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {FileInterceptor} from "@nestjs/platform-express";
import {ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {ValidateFilePipe} from "../share/validate-file.pipe";
import {BankingService} from "./banking.service";
import { ImportTransactionRo } from './models/import-transaction.ro';

@ApiTags('Banking API')
@Controller('banking')
export class BankingController {
    constructor(
        private backingService: BankingService,
    ) {
    }

    @ApiOperation({
        summary: 'Import transaction file'
    })
    @ApiOkResponse({type: ImportTransactionRo})
    @Post('import-bank-transaction')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    //property
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    importBankTransaction(@UploadedFile(ValidateFilePipe) file: Express.Multer.File) {
        return this.backingService.emitBankTransaction(file);
    }
}
