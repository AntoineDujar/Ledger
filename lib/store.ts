import {create} from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Session } from "@supabase/supabase-js";
import { ExpenseFormat } from "@/lib/sync";

type Expense = {
    expense: Array<ExpenseFormat>;
}

export const localExpenses = create(persist<Expense>(
    (set) => ({
        expense: [],
    }), {
        name: 'local-expenses',
        storage: createJSONStorage(() => AsyncStorage),
    }
),);

export const toInsertExpenses = create(persist<Expense>(
    (set) => ({
        expense: [],
    }), {
        name: 'to-insert-expenses',
        storage: createJSONStorage(() => AsyncStorage),
    }
),);

export const toUpdateExpenses = create(persist<Expense>(
    (set) => ({
        expense: [],
    }), {
        name: 'to-update-expenses',
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