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
package org.apache.camel.karavan.docker;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Arrays;

import com.github.dockerjava.api.model.HostConfig;

public enum DockerProperty {

    MEMORY("withMemory", Long.class),

    MEMORY_SWAP("withMemorySwap", Long.class),

    MEMORY_SWAPPINESS("withMemorySwappiness", Long.class),

    MEMORY_RESERVATION("withMemoryReservation", Long.class),

    KERNEL_MEMORY("withKernelMemory", Long.class),

    OOM_KILL_DISABLE("withOomKillDisable", Boolean.class),

    CPUS("withNanoCPUs", Long.class),

    CPU_PERIOD("withCpuPeriod", Long.class),

    CPU_QUOTA("withCpuQuota", Long.class),

    CPUSET_CPUS("withCpusetCpus"),

    CPUSET_MEMS("withCpusetMems"),

    CPU_SHARES("withCpuShares", Integer.class);

    private String propertyMethod;

    private Class propertyType;

    public static DockerProperty get(String key) {
        return Arrays.stream(DockerProperty.values())
                .filter(property -> property.name().equalsIgnoreCase(key) ).findAny()
                .orElseThrow(() -> new IllegalArgumentException("unknown property key '" + key + "'"));
    }

    private DockerProperty(String propertyMethod) {
        this(propertyMethod, String.class);
    }

    private DockerProperty(String propertyMethod, Class propertyType) {
        this.propertyMethod = propertyMethod;
        this.propertyType = propertyType;
    }


    public void setValue(HostConfig hostConfig, String value) {

        try {
            Method method = hostConfig.getClass().getMethod(propertyMethod, propertyType);
            if (Long.class.equals(propertyType)) {
                method.invoke(hostConfig, Long.parseLong(value));
            } else if (Integer.class.equals(propertyType)) {
                method.invoke(hostConfig, Integer.parseInt(value));
            } else if (Boolean.class.equals(propertyType)) {
                method.invoke(hostConfig, Boolean.parseBoolean(value));
            } else if (String.class.equals(propertyType)) {
                method.invoke(hostConfig, value);
            } else {
                throw new IllegalArgumentException("unhandled type argument '" + propertyType + "'");
            }

        } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
            throw new RuntimeException("Exception while updating docker property '" + name() + "' of type '" 
            + propertyType + "' with value '" + value +"'", e);
        }

    }

}
