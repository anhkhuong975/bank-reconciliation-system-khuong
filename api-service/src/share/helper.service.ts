import {CSV_VALIDATE, TransactionTypeEnum} from "./constain";
import * as moment from "moment";

const { Readable } = require('stream');

export class HelperService {

    /**
     * @description check row of transaction
     * @param item
     */
    public static isValidRow(item: any) {
        return typeof item !== 'object' || item.length !== CSV_VALIDATE.COLUMN_NUM;
    }

    /**
     * @description check validate of header csv file
     * @param item
     */
    public static isValidHeaderCSV(item: string[]): boolean {
        if (typeof item !== 'object' || item.length !== CSV_VALIDATE.COLUMN_NUM) {
            return true;
        }
        if (item[0].toUpperCase() !== CSV_VALIDATE.HEADERS.DATE) {
            return true;
        }
        if (item[1].toUpperCase() !== CSV_VALIDATE.HEADERS.CONTENT) {
            return true;
        }
        if (item[2].toUpperCase() !== CSV_VALIDATE.HEADERS.AMOUNT) {
            return true;
        }
        return item[3].toUpperCase() !== CSV_VALIDATE.HEADERS.TYPE;
    }

    /**
     * @description check validate the string of date
     * @param str
     */
    public static isValidDate(str: string): boolean {
        if (str.length !== CSV_VALIDATE.LENGTH_DATE) {
            return true;
        }
        return moment(str, 'DD/MM/YY hh:mm:ss',true).isValid();
    }

    /**
     * @description check valid of type in transaction
     * @param str
     */
    public static isValidType(str: string): boolean {
        return !CSV_VALIDATE.TRANSACTION_TYPE.includes(str);
    }

    /**
     * @description chech max length of content
     * @param str
     */
    public static isValidContent(str: string): boolean {
        return str.length >= CSV_VALIDATE.LENGTH_CONTENT;
    }

    /**
     * @description check validate amount type with typeTransaction
     * @param str
     * @param typeTransaction
     */
    public static isValidAmount(str: string, typeTransaction: TransactionTypeEnum): boolean {
        const reAmount = Number(str);
        if (isNaN(reAmount)) {
            return true;
        }
        if (typeTransaction === TransactionTypeEnum.Deposit) {
            if (reAmount < 0) {
                return true;
            }
        }
        if (typeTransaction === TransactionTypeEnum.Withdraw) {
            if (reAmount > 0) {
                return true;
            }
        }
        return false;
    }

    /**
     * @param binary Buffer
     * returns readableInstanceStream Readable
     */
    public static bufferToStream(binary) {
        return new Readable({
            read() {
                this.push(binary);
                this.push(null);
            }
        });
    }
}