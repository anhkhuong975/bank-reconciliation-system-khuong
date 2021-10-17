export enum MESSAGE_ERROR {
    FILE_EXPECTED = 'Validation failed. File expected',
    ONLY_ONE = 'Validation failed. Only one file in a progress',
    ONLY_CSV = 'Validation failed. Only upload CSV or EXCEL type',
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
    LENGTH_CONTENT: 225,
    TRANSACTION_TYPE: ['Deposit', "Withdraw"],
    TYPE_FILE: [
        'text/csv',
        'application/csv',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'application/octet-stream',
    ]
};

export enum TransactionTypeEnum {
    Deposit = 'Deposit',
    Withdraw = 'Withdraw',
}

export const SERVICE_NAME = 'api-service';

export enum MessagePatternEnum {
    BANK_TRANSACTION = 'BANK_TRANSACTION',
}
