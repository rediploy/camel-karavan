/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import '../karavan.css';
import './beanio.css';
import { useEffect, useState } from 'react';
import { Editor } from '@monaco-editor/react';
import { shallow } from 'zustand/shallow';
import { BeanioEventBus, useBeanioStore,BeanioAPI } from './beanioStore';
import { Button, Drawer, DrawerContent, DrawerContentBody, DrawerPanelContent, Flex, FlexItem } from '@patternfly/react-core';
import PlusIcon from "@patternfly/react-icons/dist/esm/icons/plus-icon";
import { BeanioProperties } from './beanioProperties';
import { useFileStore } from '../../api/ProjectStore';
import { BeanioProperty, Field, Record, Stream } from './beanio';
import { ProjectService } from '../../api/ProjectService';
import { ProjectFile } from '../../api/ProjectModels';

export function BeanioDesigner() {
    const [beanio, updateBeanIo, selectedStep, setSelectedStep] = useBeanioStore((b) => [b.beanio, b.updateBeanIo, b.selectedStep, b.setSelectedStep], shallow)
    const {file, operation,setFile} = useFileStore();

    useEffect(() => {
        const sub = BeanioEventBus.onBeanioUpdate()?.subscribe((update: any) => {
            const xml = BeanioAPI.jsonToXml(update) as string;
            if (file && xml) {
                file.code = xml;
               // setFile('none', file,undefined);
                ProjectService.saveFile(file as ProjectFile, true);
            }
        });
        return () => {
            sub.unsubscribe();
        }
    }, []);
    function createNewStream() {
        const newStream = new Stream();
        updateBeanIo({ ...beanio, stream: [...beanio.stream, newStream] });
        setSelectedStep(newStream);
    }
    function getCreateNewStream() {
        return (<div className='add-stream'><Button
        variant="primary"
        icon={<PlusIcon/>}
        onClick={e => createNewStream()}
    >
        Create New Stream
    </Button></div>)
    }
function getPropertiesPanel(){
    return (<DrawerPanelContent style={{ transform: "initial" }}
        isResizable
        hasNoBorder
        defaultSize={'400px'}
        maxSize={'800px'}
        minSize={'400px'}
    >
        <BeanioProperties />
    </DrawerPanelContent>);
}
    
    function createNewRecord(stream: Stream) {
        const newRecord = new Record();
        const clonedStream = beanio.stream.find(s => s.id === stream.id);
        if (clonedStream) {
            const clonedRecords = clonedStream?.records ? [...clonedStream.records, newRecord] : [newRecord];
        clonedStream["records"]=clonedRecords
        const newBeanio = {
            stream:[...beanio.stream.filter(s => s.id !== stream?.id),clonedStream]
        }
        updateBeanIo(newBeanio);
            setSelectedStep(newRecord);
        }
        
    }
    function createNewField(record: Record, stream: Stream) {
        const newField = new Field();
        const clonedStream = beanio.stream.find(s => s.id === stream.id);
        
        if (clonedStream && clonedStream.records) {
            const clonedRecord = clonedStream?.records.find(r => r.id === record.id);
            if (clonedRecord) {
                (clonedRecord as any)["fields" ]= clonedRecord?.fields ? [...clonedRecord.fields, newField] : [newField];
                clonedStream["records"] = [...clonedStream.records.filter(r => r.id != record.id),clonedRecord];
            const newBeanio = {
                stream:[...beanio.stream.filter(s => s.id !== stream?.id),clonedStream]
            }
            updateBeanIo(newBeanio);
            setSelectedStep(newField);
            }
          
        }
        
    }
    function onSelect(property:Record|Stream|Field) {
        setSelectedStep(property);
    }
    function getBodyContent() {
        return (<>
            {beanio.stream?.map((stream: Stream) => {
             return (
                 <div key={"root" + stream.id} className="stream-element" >
                     <Flex justifyContent={{ default: 'justifyContentCenter' }}>
                         <FlexItem><h1>Stream</h1></FlexItem>
                     </Flex>
                         <Flex className='stream-header row' onClick={()=>onSelect(stream)}>
                                <FlexItem>{stream.streamName}</FlexItem>
                         <FlexItem>{stream.format}</FlexItem>
                         <FlexItem><Button icon={<PlusIcon />} onClick={(e) => { e.stopPropagation(); createNewRecord(stream) }}> Add New Record</Button></FlexItem>
                     </Flex>
                     <Flex justifyContent={{ default: 'justifyContentCenter' }}> 
                         <FlexItem><h1>Records</h1></FlexItem>
                     </Flex>
                     {stream.records?.map((record: Record) => {
                         return (<section className='stream-record row'>
                             <Flex  className='record-row' justifyContent={{ default: 'justifyContentSpaceBetween' }} onClick={()=>onSelect(record)}>
                                 <FlexItem>{record.recordName}</FlexItem>
                                 <FlexItem>{record.position}</FlexItem>
                                 <FlexItem>{record.length}</FlexItem>
                                 <FlexItem><Button icon={<PlusIcon />} onClick={(e) => { e.stopPropagation(); createNewField(record, stream) }}> Add New Field</Button></FlexItem>
                             </Flex>
                     
                             {record.fields?.map((field: Field) => {
                                    return (
                                        <Flex className='record-field row' justifyContent={{ default: 'justifyContentSpaceBetween' }} onClick={() => onSelect(field)}>
                                            <FlexItem>{field.fieldName}</FlexItem>
                                            <FlexItem>{field.rid}</FlexItem>
                                            <FlexItem>{field.literal}</FlexItem>
                                        </Flex>
                                        
                                    )
                                })}
                         </section>
                                    
                         )
                     })}
                     
                     
              </div>)
         })}
        </>
        )
}
    return (
        <div className="beanio-page">
            <Drawer isExpanded isInline>
                    <DrawerContent panelContent={getPropertiesPanel()}>
                    <DrawerContentBody>{getBodyContent()}
                        {getCreateNewStream()}</DrawerContentBody>
                    </DrawerContent>
                </Drawer>
        </div>
    )
}
