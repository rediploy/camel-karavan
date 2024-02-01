import {createWithEqualityFn} from "zustand/traditional";
import {shallow} from "zustand/shallow";
import { BeanioProperty ,Record,Field, Stream} from "./beanio";
import { Message } from "react-hook-form";
import { Subject, Observable, BehaviorSubject } from "rxjs";
import { toXML } from "jstoxml";

import { ProjectService } from "../../api/ProjectService";

interface BeanioState{
    beanio: BeanioProperty;
    selectedStep: any;
    setSelectedStep: (node: any) => void;
    updateBeanIo:(record:BeanioProperty)=>void
}
export const useBeanioStore = createWithEqualityFn<BeanioState>((set) => ({
    beanio: {
        stream: []
    },
    selectedStep: null,
    updateBeanIo: (record) => {
        set((state: BeanioState) => {
            BeanioEventBus.sendBeanioUpdate(record);
            return { beanio: record };
        })
    },
    setSelectedStep: (node) => {
        set((state) => ({
            selectedStep: node
        }));
    }
    
}));
const beanio = new BehaviorSubject<BeanioProperty | undefined>(undefined);

export const BeanioEventBus ={
    sendBeanioUpdate(record: BeanioProperty) {
        beanio.next(record);
    },
    onBeanioUpdate: () => beanio.asObservable()
  }
export class BeanioAPI { 
    constructor() {
        
    }
    static jsonToXml = (json:any) => { 
        if (json && json.stream) {
            const stream: Stream = json.stream[0];
             let streamContent: any[] = [];
            stream.records?.forEach((record:Record) => {
                let fieldsArray :any= [];
                record.fields?.forEach((fields: Field) => {
                    let newField = {
                        _name: 'field',
                        _content:'',
                        _attrs: {
                            name: fields.name,
                            rid: fields.rid,
                            regex:fields.regEx
                        }
                    };
                    fieldsArray.push(newField);
                });
                let newRecord = {
                    _name: 'record',
                    _content: fieldsArray,
                    _attrs: {
                        name:record.name,
                        length: record.length,
                        position:record.position
                    }
                }
                streamContent.push(newRecord)
            });
            
        
            const jsonToConvert = {
                _name: 'stream',
                _content:streamContent,
                _attrs: {
                    name: stream?.name,
                    format:stream?.format
                }
            }
            const config = {
                indent: '    '
            };
            const xml =toXML(jsonToConvert);
            return xml;
        }
    }
    static xmlToJson = (xml: any) => {
      //  const json =toJson(xml,{object:true});
        console.log(xml);
        debugger;
        return xml;
    }
}
