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
import { useState } from 'react';
import { Editor } from '@monaco-editor/react';
import { shallow } from 'zustand/shallow';
import { useBeanioStore } from './beanioStore';
import { Button, Drawer, DrawerContent, DrawerContentBody, DrawerPanelContent } from '@patternfly/react-core';
import PlusIcon from "@patternfly/react-icons/dist/esm/icons/plus-icon";
import { BeanioProperties } from './beanioProperties';

export function BeanioDesigner() {
    const [beanIo, updateBeanIo, activeNode, setActiveNode] = useBeanioStore((b) => [b.beanIo, b.updateBeanIo, b.activeNode, b.setActiveNode], shallow)


    function createNewStream() {
        
    }
    function getCreateNewStream() {
        return (<Button
            variant="primary"
            icon={<PlusIcon/>}
            onClick={e => createNewStream()}
        >
            Create New Stream
        </Button>)
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
    

    return (
        <div className="beanio-page">
            <Drawer isExpanded isInline>
                    <DrawerContent panelContent={getPropertiesPanel()}>
                        <DrawerContentBody> {getCreateNewStream()}</DrawerContentBody>
                    </DrawerContent>
                </Drawer>
        </div>
    )
}
