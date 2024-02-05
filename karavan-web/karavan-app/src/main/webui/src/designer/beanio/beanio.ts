

import { ElementMeta, PropertyMeta } from 'karavan-core/lib/model/CamelMetadata';
import { v4 as uuidv4 } from 'uuid';
import { boolean } from 'yup';

export declare class BeanioProperty {
    stream: Stream[];
    constructor(init?: Partial<BeanioProperty>);

}
export class Stream {
    streamName?: string;
    format?: string;
    records?: Record[];
    dslName: string = 'stream';
    id: string;
    minOccurs?: number;
    maxOccurs?: number;
    parser?: boolean;
    constructor() {
        this.id = uuidv4();
        this.records = [];
    }

}
export  class Record{
    recordName?: string;
    position?: number;
    length?: number;
    fields?: Field[];
    dslName: string = 'record';
    id: string;
    constructor() {
        this.id = uuidv4();
        this.fields = [];
    }
}

export class Field{
    fieldName: string='';
    rid: boolean=false;
    literal: string='';
    regEx: string = '';
    id: string;
    dslName: string = "field";
    constructor() {
        this.id = uuidv4();
    }
}
export class BeanioMetadataApi { 
    static getBeanIolMetadataByName = (name: string|undefined): ElementMeta | undefined => {
        return BeanioMetadata.find(value => value.name === name);
     }
}

export const BeanioMetadata: ElementMeta[] = [
    new ElementMeta('stream', 'StreamDefinition', 'Stream', "Collects the records", '', [
        new PropertyMeta('streamName', 'Name', "Sets the name of this stream", 'string', '', '', true, false, false, false, '', ''),
        new PropertyMeta('format', 'Format', "Format of the stream", 'string', 'csv,xml,delimiter,fixedLength', 'xml', true, false, true, true, '', ''),
        new PropertyMeta('minOccurs', 'Min Occurs', "Mininium number of occurrences", 'number', '', '', false, false, false, false, '', ''),
        new PropertyMeta('maxOccurs', 'Max Occurs', "Maximum number of occurrences", 'number', '', '', false, false, false, false, '', ''),
        new PropertyMeta('parser', 'Parser', "Parser Elements", 'boolean', '', 'false', false, false, false, false, '', ''),
    ]),
    new ElementMeta('record', 'Recordefinition', 'Record', "Collects the record details", '', [
        new PropertyMeta('recordName', 'Name', "Sets the name of this record", 'string', '', '', false, false, false, false, '', ''),
        new PropertyMeta('position', 'Position', "Position of the record", 'number', '', '', false, false, false, false, '', ''),
        new PropertyMeta('length', 'Length', "length of the record", 'number', '', '', false, false, false, false, '', ''),
    ]),
    new ElementMeta('field', 'FieldDefinition', 'Field', "Collects the Fields", '', [
        new PropertyMeta('fieldName', 'Name', "Sets the name of this Field", 'string', '', '', false, false, false, false, '', ''),
        new PropertyMeta('rid', 'Rid', "Record identifier", 'boolean', '', 'false', false, false, false, false, '', ''),
        new PropertyMeta('literal', 'literal', "Records to be added", 'string', '', '', false, false, false, false, '', ''),
        new PropertyMeta('regEx', 'regEx', "regEx to be added", 'string', '', '', false, false, false, false, '', ''),
    ]),
    new ElementMeta('parser', 'ParserDefinition', 'Parser', "Collects the values of the parser", '', [
        new PropertyMeta('delimiter', 'Delimiter', "Sets the delimiter for the stream", 'string', 'csv,delimiter', '', false, false, false, false, '', ''),
        new PropertyMeta('quote', 'quote', "Quote", 'string', 'csv', '', false, false, false, false, '', ''),
        new PropertyMeta('escape', 'escape', "Escape", 'string', 'csv,delimiter', '', false, false, false, false, '', ''),
        new PropertyMeta('comments', 'comments', "Comments", 'string', 'csv,delimiter,fixedLength', '', false, false, false, false, '', ''),
        new PropertyMeta('multilineEnabled', 'multilineEnabled', "Multi Line Enables", 'boolean', 'csv', '', false, false, false, false, '', ''),
        new PropertyMeta('whitespaceAllowed', 'whitespaceAllowed', "White Space Allowed", 'boolean', 'csv', '', false, false, false, false, '', ''),
        new PropertyMeta('unquotedQuotesAllowed', 'unquotedQuotesAllowed', "Unquoted Quotes Allowed", 'boolean', 'csv', '', false, false, false, false, '', ''),
        new PropertyMeta('recordTerminator', 'recordTerminator', "Record Terminator", 'string', 'csv,delimiter,fixedLength', '', false, false, false, false, '', ''),
        new PropertyMeta('alwaysQuote', 'alwaysQuote', "Always Quote", 'boolean', 'csv', 'false', false, false, false, false, '', ''),
        new PropertyMeta('lineContinuationChar', 'lineContinuationChar', "line Continuation Char", 'char', 'delimiter,fixedLength', '', false, false, false, false, '', ''),
        new PropertyMeta('suppressHeader', 'SuppressHeader', "Suppress Header", 'boolean', 'xml', 'false', false, false, false, false, '', ''),
        new PropertyMeta('version', 'Version', "Version", 'number', 'xml', '', false, false, false, false, '', ''),
        new PropertyMeta('encoding', 'encoding', "encoding", 'string', 'xml', 'utf-8', false, false, false, false, '', ''),
        new PropertyMeta('namespaces', 'Namespaces', "namespaces", 'string', 'xml', '', false, false, false, false, '', ''),
        new PropertyMeta('indentation', 'Indentation', "indentation", 'string', 'xml', '', false, false, false, false, '', ''),
        new PropertyMeta('lineSeparator', 'Line Separator', "Line Separator", 'string', 'xml', '', false, false, false, false, '', ''),
        new PropertyMeta('xmlName', 'XML Name', "XML Name", 'string', 'xml', '', false, false, false, false, '', ''),
        new PropertyMeta('xmlType', 'XML Type', "XML Type", 'string', 'xml', '', false, false, false, false, '', ''),
    ]),

];