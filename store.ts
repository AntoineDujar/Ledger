import {create} from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'


type CounterStore = {
    count: number;
    increment: () => void;
    decrement: () => void;
};

export const userCounterStore = create(persist<CounterStore>(
    (set) => ({
    count: 0,
    increment: () => {
        set((state) => ({ count: state.count + 1}));
    },
    decrement: () => {
        set((state) => ({ count: state.count - 1}));
    },
}), {
name: 'food-storage',
storage: createJSONStorage(() => AsyncStorage),
}
),);