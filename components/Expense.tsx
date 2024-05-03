import React, { Children, useState, useEffect } from 'react';
import { Text } from 'react-native-elements';
import MyButton from '@/ui/MyButton';
import {
  Alert,
  StyleSheet,
  View,
  AppState,
  FlatList,
} from 'react-native';
import { supabase } from '@/lib/supabase';
import {
  localExpenses,
  toInsertExpenses,
  toUpdateExpenses,
  userAuth,
} from '@/lib/store';
import { YStack, Input, Theme, Form, Button } from 'tamagui';
import { ExpenseFormat, syncExpense } from '@/lib/sync';
import { z, ZodError } from 'zod';

const ExpenseSchema = z.object ({
  id: z.string(),
  label: z.string().refine(value => value.trim().length > 0, {
    message: 'label is required',
  }),
  amount: z.number().min(0, 'Amount must be greater than or equal to 0'),
  auth_id: z.string(),
  created_at: z.string(),
  date_deleteded: z.string().or(z.null()).or(z.undefined())
})

function validateExpenseData(data: ExpenseFormat){
  const result = ExpenseSchema.safeParse(data);
  if(!result.success){
    console.error('validation errors: ', result.error.errors);
    throw new Error('Validation failed');
  }
  return true;
}

export default function Spend() {
  const [amountInput, setAmountInput] = useState('');
  const [labelInput, setLabelInput] = useState('');
  const [triggerRerender, setTriggerRerender] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const sampleExpense: ExpenseFormat = {
    id: '',
    label: labelInput,
    amount: parseFloat(amountInput),
    auth_id: '',
    created_at: '',
    date_deleted: null,
  };

  async function insertExpense() {
    const n = toInsertExpenses.getState().expense.length;
    try{ 
      const temp = { ...sampleExpense, id: n.toString() + 'toInsert' };
      validateExpenseData(temp)

      const current = toInsertExpenses.getState().expense;
      toInsertExpenses.setState({ expense: [...current, temp] });

      const localCurrent = localExpenses.getState().expense;
      localExpenses.setState({ expense: [...localCurrent, temp] });
  
    } catch (error) {
      setErrorMessage('Expense validation failed');
    } finally {
      setAmountInput('');
      setLabelInput('');
      setErrorMessage(' ');
      await syncRenderer();
    }

  }

  async function updateExpense(index: number, id: string) {
    
    try{
      const temp = { ...sampleExpense, id: id };
      validateExpenseData(temp);
      if (id.toString().includes('toInsert')) {
        const index = toInsertExpenses
        .getState()
        .expense.findIndex((expense) => expense.id === id);
        const current = toInsertExpenses.getState().expense;
        current[index] = temp;
      } else {
        const current = toUpdateExpenses.getState().expense;
        toUpdateExpenses.setState({ expense: [...current, temp] });
      }
      const localCurrent = localExpenses.getState().expense;
      localCurrent[index] = temp;
      localExpenses.setState({ expense: localCurrent });
    } catch (error) {
      setErrorMessage('Expense validation failed');
    } finally {
      setAmountInput('');
      setLabelInput('');
      //setErrorMessage('');
      await syncRenderer();
    }
  }

  async function deleteExpense(
    index: number,
    id: string,
    amount: number,
    label: string,
  ) {
    const temp = {
      ...sampleExpense,
      id: id,
      label: label,
      amount: amount,
      date_deleted: Date(),
    };

    if (id.toString().includes('toInsert')) {
      const index = toInsertExpenses
        .getState()
        .expense.findIndex((expense) => expense.id === id);
      const current = toInsertExpenses.getState().expense;
      current[index] = temp;
    } else {
      const current = toUpdateExpenses.getState().expense;
      toUpdateExpenses.setState({ expense: [...current, temp] });
    }
    const localCurrent = localExpenses.getState().expense;
    localCurrent[index] = temp;
    localExpenses.setState({ expense: localCurrent });

    hideDeleted();
    await syncRenderer();
  }

  async function syncRenderer() {
    await syncExpense();
    setTriggerRerender(!triggerRerender);
  }

  function printToInsert() {
    // console.log(toInsertExpenses.getState().expense);
    console.log(localExpenses.getState().expense);
  }

  function hideDeleted() {
    const current = localExpenses
      .getState()
      .expense.filter((entry) => entry.date_deleted === null);
    localExpenses.setState({ expense: current });
    setTriggerRerender(!triggerRerender);
  }

  const Item = ({
    label,
    amount,
    id,
    index,
  }: ExpenseFormat & { index: number }) => {
    return (
      <View style={styles.expense}>
        <Text style={styles.item}>{amount}</Text>
        <Text style={styles.item}>{label}</Text>
        <MyButton
          label='Edit'
          onPress={() => updateExpense(index, id)}
        />
        <MyButton
          label='Delete'
          onPress={() => deleteExpense(index, id, amount, label)}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Theme name='light'>
        <Theme name='red'>
          <YStack
            padding='$3'
            minWidth={250}
            alignSelf='center'
            gap='$2'
          >
            <Input
              placeholder={`Amount`}
              onChangeText={(text) => setAmountInput(text)}
              value={amountInput}
            />
            <Input
              placeholder={`Label`}
              onChangeText={(text) => setLabelInput(text)}
              value={labelInput}
            />
            {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
            <MyButton
              label='Insert'
              onPress={() => insertExpense()}
            />

            <MyButton label='Sync' onPress={() => syncRenderer()} />
            <MyButton
              label='Print insert'
              onPress={() => printToInsert()}
            />
            <MyButton
              label='hideDelete'
              onPress={() => hideDeleted()}
            />
          </YStack>
        </Theme>
      </Theme>

      <FlatList
        data={localExpenses.getState().expense}
        renderItem={({ item, index }) => (
          <Item {...item} index={index} />
        )}
        keyExtractor={(item) => item.id.toString()}
        extraData={triggerRerender}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    marginBottom: 10,
    fontSize: 25,
  },
  expense: {
    flexDirection: 'row',
    flex: 1,
  },
  item: {
    marginRight: 10,
    marginBottom: 10,
    fontSize: 15,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
 },
});
