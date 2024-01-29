import {createWithEqualityFn} from "zustand/traditional";
import {shallow} from "zustand/shallow";
import { BeanioProperty ,Record,Field, Stream} from "./beanio";

interface BeanioState{
    beanIo: BeanioProperty;
    activeNode: Stream | Record | Field |null;
    setActiveNode: (node: Stream | Record | Field | null) => void;
    updateBeanIo:(record:BeanioProperty)=>void
}
export const useBeanioStore = createWithEqualityFn<BeanioState>((set) => ({
    beanIo: {
        stream: []
    },
    activeNode: null,
    updateBeanIo: (record) => {
        set((state: BeanioState) => ({
            beanIo: record
        }));
    },
    setActiveNode: (node) => {
        set((state) => ({
            activeNode: node
        }));
    }
    
}));
