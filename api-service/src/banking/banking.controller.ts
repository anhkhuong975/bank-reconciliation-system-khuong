import {Controller, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {FileInterceptor} from "@nestjs/platform-express";
import {ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {ValidateFilePipe} from "../share/validate-file.pipe";

@ApiTags('Banking API')
@Controller('banking')
export class BankingController {

    @ApiOperation({
        summary: 'Import transaction file'
    })
    @ApiOkResponse({})
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
    uploadFile(@UploadedFile(ValidateFilePipe) file: Express.Multer.File) {
        console.log(file);
        return file;
    }
}
