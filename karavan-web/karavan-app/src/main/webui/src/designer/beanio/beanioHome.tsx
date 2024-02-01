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
import {

    PageSection,
    Tab,
    TabTitleIcon,
    TabTitleText,
    Tabs,
} from '@patternfly/react-core';
import '../karavan.css';
import './beanio.css';
import { useState } from 'react';
import { getDesignerIcon } from '../icons/KaravanIcons';
import { BeanioDesigner } from './beanioDesigner';
import { BeanioEditor } from './beanioEditor';
import { shallow } from 'zustand/shallow';
import { useFileStore, useFilesStore } from '../../api/ProjectStore';

export function BeanioHome() {
    const [tab, setTab] = useState<string>('beanio');

    
    function getTab(title: string, tooltip: string, icon: string, showBadge: boolean = false) {
        const color=  "initial";
        return (
            <div className="top-menu-item" style={{color: color}}>
                <TabTitleIcon>{getDesignerIcon(icon)}</TabTitleIcon>
                <TabTitleText>{title}</TabTitleText>
            </div>
        )
    }


    return (
        <PageSection className="bean-designer" isFilled padding={{ default: 'noPadding' }}>

            <Tabs className="main-tabs"
                      activeKey={tab}
                      onSelect={(event, tabIndex) => {
                          setTab(tabIndex.toString());
                      }}
                      style={{width: "100%"}}>
                    <Tab eventKey='beanio' title={getTab("Bean IO", "Bean IO", "beanio")}></Tab>
                    <Tab eventKey='code' title={getTab("XML", "XML Code", "code", true)}></Tab>

            </Tabs>

            {tab === 'beanio' && <BeanioDesigner/>}
            {tab === 'code' && <BeanioEditor/>}

        </PageSection>

        
    )
}
