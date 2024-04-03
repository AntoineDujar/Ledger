import {create} from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Session } from "@supabase/supabase-js";

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

interface ExpenseInterface {
    id: number;
    label: string;
    amount: number;
    auth_id: string;
    created_at: string;
  }

type Expense = {
    expense: Array<ExpenseInterface>;
}

export const localExpenses = create(persist<Expense>(
    (set) => ({
        expense: [],
    }), {
        name: 'local-expenses',
        storage: createJSONStorage(() => AsyncStorage),
    }
),);

export const toSyncExpenses = create(persist<Expense>(
    (set) => ({
        expense: [],
    }), {
        name: 'local-toSync-expenses',
        storage: createJSONStorage(() => AsyncStorage),
    }
),);

type AuthState = {
    currSession: Session | null;
};

export const userAuth = create<AuthState>(
(set) => ({
    currSession: null,
}));