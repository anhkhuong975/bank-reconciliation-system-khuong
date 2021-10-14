export enum MESSAGE_ERROR {
    FILE_EXPECTED = 'Validation failed. File expected',
    ONLY_ONE = 'Validation failed. Only one file in a progress',
    ONLY_CSV = 'Validation failed. Only one CSV type in upload',
    FILE_HEADER_INVALID = 'Validate failed. File format header invalid'
}


export const CSV_VALIDATE = {
    HEADERS: {
        DATE: 'DATE',
        CONTENT: 'CONTENT',
        AMOUNT: 'AMOUNT',
        TYPE: 'TYPE',
    },
    LENGTH_DATE: 19,
    COLUMN_NUM: 4,
    TRANSACTION_TYPE: ['Deposit', "Withdraw"],
};

export const SERVICE_NAME = 'api-service';

export enum MessagePatternEnum {
    BANK_TRANSACTION = 'BANK_TRANSACTION',
}
