import { DrawerHead, Text, DrawerActions, DrawerCloseButton, DrawerPanelBody, InputGroup, InputGroupItem, Label, TextInput, Form, FormGroup, Button, TextVariants, Title, Tooltip, Switch, TextInputGroup } from "@patternfly/react-core";
import { shallow } from "zustand/shallow";
import { useBeanioStore } from "./beanioStore";
import { FormEvent, JSXElementConstructor, ReactElement, ReactNode, ReactPortal, cloneElement, useEffect, useState } from "react";
import { BeanioMetadataApi, BeanioProperty,  Stream } from './beanio';
import { ProjectFileTypes, getProjectFileType } from "../../api/ProjectModels";
import { useFileStore } from "../../api/ProjectStore";
import { SelectDirection, SelectVariant,Select,SelectOption } from "@patternfly/react-core/deprecated";
import { PropertyMeta } from "karavan-core/lib/model/CamelMetadata";

export function BeanioProperties(_props: any) {
    const [beanio, updateBeanIo, selectedStep, setSelectedStep] = useBeanioStore((b) => [b.beanio, b.updateBeanIo, b.selectedStep, b.setSelectedStep], shallow)
    const { file, operation } = useFileStore();
    const [selectStatus, setSelectStatus] = useState<Map<string, boolean>>(new Map<string, boolean>());
    const Element = BeanioMetadataApi.getBeanIolMetadataByName(selectedStep?.dslName);
    const properties: PropertyMeta[] = Element?.properties || [];
    const kind = file ? getProjectFileType(file) : '';

    function openSelect(propertyName: string, isExpanded: boolean) {
        setSelectStatus(new Map<string, boolean>([[propertyName, isExpanded]]))
    }

    function clearSelection(propertyName: string) {
        setSelectStatus(new Map<string, boolean>([[propertyName, false]]))
    }

    function isSelectOpen(propertyName: string): boolean {
        return selectStatus.get(propertyName) === true;
    }
    function getBeanioHeader() {
        return (<div className="headers">
            <FormGroup label="Kind" fieldId="kind" isRequired>
                <TextInput className="text-field" type="text" id="kind" name="kind"
                    value={kind} readOnlyVariant="default" />
            </FormGroup>
            <FormGroup label="Name" fieldId="name" isRequired>
                <TextInput className="text-field" type="text" id="name" name="name"
                    value={file?.name} readOnlyVariant="default" />
            </FormGroup>

        </div>)
    }

    function getPropertiesHeader() {
        const description = Element?.description;
        const descriptionLines: string[] = description ? description?.split("\n") : [""];
        return (<div className="headers">
            <div className="top">
                <Title headingLevel="h1" size="md">{Element?.title}</Title>

            </div>
            {descriptionLines.map((desc, index, _array) => <Text key={index}
                component={TextVariants.p}>{desc}</Text>)}
        </div>);
    }
    function onChangeProperty(value:any, property: any) {
        
            if (selectedStep.dslName ==='stream') {
                onChangeStreamProperty(value, property.name);
            }
            else if (selectedStep.dslName === 'record') {
                onChangeRecordProperty(value, property.name);
            }
            else if (selectedStep.dslName === 'field') {
                onChangeFieldProperty(value, property.name);
    
            } 
        
        
        clearSelection(property.name);
    }
    function onChangeStreamProperty(value: string, name: string) {
        const cloneStream = beanio.stream.find(s => s.id === selectedStep?.id);
        if (cloneStream) {
            (cloneStream as any)[name] = value;
            setSelectedStep(cloneStream);
            updateBeanIo({ stream: [...beanio.stream.filter(s => s.id !== selectedStep?.id), cloneStream] });
        }

    }
    function onChangeRecordProperty(value: string, name: string) {
        const clonedStream = beanio.stream.find(s => (s.records?.find(r => r.id === selectedStep.id)));

        if (clonedStream) {
            const record = clonedStream.records?.find(r => r.id === selectedStep.id);
            if (clonedStream.records && record) {
                (record as any)[name] = value;
                const newBeanio = {
                    stream: [...beanio.stream.filter(s => s.id !== clonedStream?.id), { ...clonedStream ,records:[...clonedStream.records.filter(r => r.id !== selectedStep.id),record]}]
                };

                updateBeanIo(newBeanio);
                setSelectedStep(record);
            }

        }

    }
    function onChangeFieldProperty(value: string, name: string) {
        const clonedStream= beanio.stream.find(s => (s.records?.find(r => (r.fields?.find(f=>f.id === selectedStep.id)))));
        if (clonedStream) {
            const record = clonedStream.records?.find(r => r.fields?.find(f=>f.id === selectedStep.id));
            if (clonedStream.records && record) {
                const clonedField = record.fields?.find(f => f.id === selectedStep.id);
                (clonedField as any)[name] = value;
                const clonedFields = record.fields ? [...record.fields.filter(r => r.id !== selectedStep.id), clonedField] : [];
                const clonedRecords = [...clonedStream.records.filter(r => r.id !== record.id), { ...record, fields: clonedFields }];
                const newBeanio = {
                    stream: [...beanio.stream.filter(s => s.id !== clonedStream?.id), { ...clonedStream ,records:clonedRecords}]
                };
                updateBeanIo(newBeanio as BeanioProperty);
                setSelectedStep(clonedField);
            }
        }
    }
    function getProperties(mainProperties :PropertyMeta[]) {
        return (<>
            <div className="beanio-parameters">
                {mainProperties?.map((property: PropertyMeta) => {
                    return (<FormGroup label={property.displayName} fieldId={property.name} isRequired={property.required}>
                        {property.isArray && getSelectField(property, selectedStep[property.name])}
                        {(property.type==='boolean') && getSwitch(property,selectedStep[property.name])}

                        {!property.isArray && !property.isObject && (property.type!=='boolean')&& getTextField(property,selectedStep[property.name])}

                    </FormGroup>);
                                 })}
            </div>

        </>)
    }
    function getTextField(property:PropertyMeta,value:string) {
        return (<TextInput className="text-field" type={['integer', 'number'].includes(property.type) ? 'number' : (property.secret ? "password" : "text")} id={property.name} name={property.name}
                value={value} readOnlyVariant={undefined} onChange={(e) => onChangeProperty((e.target as HTMLInputElement).value, property)} />
       );
    }
    function getSelectField(property: PropertyMeta,value:string) {
        const options = property?.enumVals.split(",");
        const selectOptions:JSX.Element[] = [];

        options.forEach((option:string,index:number) => {
            selectOptions.push(<SelectOption key={index} value={option} isPlaceholder />);
        });
        return (
            <Select
                variant={SelectVariant.single}
                aria-label={property.name}
                onToggle={(event,isExpanded) => {
                    openSelect(property.name, isExpanded)
                }}
                onSelect={(e, value, isPlaceholder) => {  onChangeProperty(value, property) }}
                selections={value}
                isOpen={isSelectOpen(property.name)}
                id={property.name}
                aria-labelledby={property.name}
                direction={SelectDirection.down}
            >
                {selectOptions}
                </Select>);
    }
    function getSwitch(property: PropertyMeta, value: any) {
        const isValueBoolean = (value === true || value === false);
        const isDisabled = value !== undefined && !isValueBoolean;
        let isChecked = false;
        if (value !== undefined && isValueBoolean) {
            isChecked = Boolean(value);
        } else if ((value === undefined || value.toString().length > 0) && property.defaultValue !== undefined) {
            isChecked = property.defaultValue === 'true';
        }
        return (
            <TextInputGroup className="input-group">
                <InputGroupItem>
                    <Switch
                        isDisabled={isDisabled}
                        id={property.name + "-switch"}
                        name={property.name + "-switch"}
                        className="switch-placeholder"
                        value={value?.toString()}
                        aria-label={property.name}
                        isChecked={isChecked}
                        onChange={(_, v) => onChangeProperty( v,property)}/>
                </InputGroupItem>
                {property.placeholder && <InputGroupItem isFill>
                    <TextInput
                        id={property.name + "-placeholder"}
                        name={property.name + "-placeholder"}
                        type="text"
                        aria-label="placeholder"
                        placeholder="Property placeholder"
                        value={!isValueBoolean ? value?.toString() : undefined}
                        onChange={(_, v) => onChangeProperty( v,property)}
                    />
                </InputGroupItem>}
            </TextInputGroup>
        )
    }
    function getParserProperties() {
        const parserProperties =(BeanioMetadataApi.getBeanIolMetadataByName('parser')?.properties || []) as PropertyMeta[];
        const filterdProperties= parserProperties.filter(x=>(x.enumVals.split(",")).includes(selectedStep.format)) || [];
        return getProperties(filterdProperties);
    }
    return (
        <div key={selectedStep ? selectedStep.name : 'integration'}
            className='properties'>
            <Form autoComplete="off" onSubmit={event => event.preventDefault()}>
                {!selectedStep && getBeanioHeader()}
                {getPropertiesHeader()}
                {selectedStep && getProperties(properties)}
                {(selectedStep?.dslName==='stream')&& selectedStep.parser && getParserProperties()}

            </Form>
        </div>

    )
}