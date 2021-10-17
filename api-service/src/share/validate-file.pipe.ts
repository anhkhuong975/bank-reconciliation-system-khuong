import {
    ArgumentMetadata,
    Injectable,
    PipeTransform,
    BadRequestException,
} from '@nestjs/common';
import {CSV_VALIDATE, MESSAGE_ERROR} from "./constain";

@Injectable()
export class ValidateFilePipe implements PipeTransform {
    transform(
        file: Express.Multer.File,
        metadata: ArgumentMetadata,
    ): Express.Multer.File {
        if (file === undefined || file === null) {
            throw new BadRequestException(MESSAGE_ERROR.FILE_EXPECTED);
        }

        if (Array.isArray(file) && file.length > 1) {
            throw new BadRequestException(MESSAGE_ERROR.ONLY_ONE);
        }

        if (!CSV_VALIDATE.TYPE_FILE.includes(file.mimetype)) {
            throw new BadRequestException(MESSAGE_ERROR.ONLY_CSV);
        }

        return file;
    }
}
