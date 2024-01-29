

import { ElementMeta, PropertyMeta } from 'karavan-core/lib/model/CamelMetadata';
import { v4 as uuidv4 } from 'uuid';
import { boolean } from 'yup';

export declare class BeanioProperty {
    stream: Stream[];
    constructor(init?: Partial<BeanioProperty>);

}
export class Stream {
    name: string='';
    format: string='';
    records: Record[]=[];
    dslName: string = 'stream';

}
export  class Record{
    name: string='';
    position: number=0;
    length: number=0;
    fiedls: Field[]=[];
    dslName: string = 'record';
}

export class Field{
    name: string='';
    rid: boolean=false;
    literal: string='';
    regEx: string='';
    dslName: string = "field";
}

export class BeanioMetadataApi { 
    static getBeanIolMetadataByName = (name: string|undefined): ElementMeta | undefined => {
        return BeanioMetadata.find(value => value.name === name);
     }
}
export const BeanioMetadata: ElementMeta[] = [
    new ElementMeta('stream', 'StreamDefinition', 'Stream', "Collects the records", '', [
        new PropertyMeta('name', 'Name', "Sets the name of this stream", 'string', '', '', false, false, false, false, '', '', false),
        new PropertyMeta('format', 'Format', "Format of the stream", 'string', '', '', false, false, false, false, '', '', false),
        new PropertyMeta('record', 'Records', "Records to be added", 'array', '', '', false, false, true, false, '', '', false),
    ]),
    new ElementMeta('record', 'Recordefinition', 'Record', "Collects the record details", '', [
        new PropertyMeta('name', 'Name', "Sets the name of this record", 'string', '', '', false, false, false, false, '', '', false),
        new PropertyMeta('position', 'Position', "Position of the record", 'number', '', '', false, false, false, false, '', '', false),
        new PropertyMeta('length', 'Length', "length of the record", 'number', '', '', false, false, false, false, '', '', false),
        new PropertyMeta('fields', 'fields', "fields to be added", 'array', '', '', false, false, true, false, '', '', false),
    ]),
    new ElementMeta('field', 'FieldDefinition', 'Field', "Collects the Fields", '', [
        new PropertyMeta('name', 'Name', "Sets the name of this Field", 'string', '', '', false, false, false, false, '', '', false),
        new PropertyMeta('rid', 'Rid', "Record identifier", 'string', '', '', false, false, false, false, '', '', false),
        new PropertyMeta('literal', 'literal', "Records to be added", 'string', '', '', false, false, false, false, '', '', false),
        new PropertyMeta('regEx', 'regEx', "regEx to be added", 'string', '', '', false, false, false, false, '', '', false),

    ]),
];