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

export function BeanioEditor() {
    const [code, setCode] = useState<string>('');

    
    function onChange(code :string|undefined) {
        console.log(code);
    }


    return (
        <Editor
        height="100vh"
        defaultLanguage={'xml'}
        theme={'light'}
        value={code}
        className={'code-editor'}
        defaultValue={code}
        onChange={(value, ev) => onChange(value)}
    />
    )
}
