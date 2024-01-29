import { DrawerHead, DrawerActions, DrawerCloseButton, DrawerPanelBody, InputGroup, InputGroupItem, Label, TextInput, Form, FormGroup } from "@patternfly/react-core";
import { shallow } from "zustand/shallow";
import { useBeanioStore } from "./beanioStore";
import { useEffect } from "react";
import { BeanioMetadataApi } from './beanio';
export function BeanioProperties(props: any) {
    const [beanIo, updateBeanIo, activeNode, setActiveNode] = useBeanioStore((b) => [b.beanIo, b.updateBeanIo, b.activeNode, b.setActiveNode], shallow)

    const Element = BeanioMetadataApi.getBeanIolMetadataByName(activeNode?.dslName);
    const properties = Element?.properties.filter(obj => obj.isArray == false);

    function getBeanioHeader() {
        return ( <div className="headers">
        <FormGroup label="Kind" fieldId="kind" isRequired>
            <TextInput className="text-field" type="text" id="kind" name="kind"
                       value="" readOnlyVariant="default"/>
        </FormGroup>
        <FormGroup label="Name" fieldId="name" isRequired>
            <TextInput className="text-field" type="text" id="name" name="name"
                       value="" readOnlyVariant="default"/>
        </FormGroup>
   
    </div>)
    }
    return (
        <div key={activeNode ? activeNode.name: 'integration'}
            className='properties'>
            <Form autoComplete="off" onSubmit={event => event.preventDefault()}>
                {!activeNode && getBeanioHeader()}
                {/* <DrawerHead>
                    <span>
                        {Element?.title}
                    </span>
                    <DrawerActions>
                        <DrawerCloseButton onClick={props.onClose} />
                    </DrawerActions>
                    <DrawerPanelBody>
                        {properties?.map(property => {
                            return <InputGroup>

                                <InputGroupItem>
                                    <Label>{property.displayName}</Label>
                                </InputGroupItem>
                                <InputGroupItem>
                                    <TextInput />
                                </InputGroupItem>
                            </InputGroup>
                        })}
                    </DrawerPanelBody>
                </DrawerHead> */}
            </Form>
        </div>

    )
}