import React, { Children, useState, useEffect } from 'react';
import { Button, Input, Text } from 'react-native-elements';
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
import { YStack } from 'tamagui';
import { ExpenseFormat, syncExpense } from '@/lib/sync';

export default function Spend() {
  const [amountInput, setAmountInput] = useState('');
  const [labelInput, setLabelInput] = useState('');
  const [triggerRerender, setTriggerRerender] = useState(false);

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
    const temp = { ...sampleExpense, id: n.toString() + 'toInsert' };

    console.log(temp);
    const current = toInsertExpenses.getState().expense;
    toInsertExpenses.setState({ expense: [...current, temp] });

    const localCurrent = localExpenses.getState().expense;
    localExpenses.setState({ expense: [...localCurrent, temp] });

    setAmountInput('');
    setLabelInput('');

    await syncRenderer();
  }

  async function updateExpense(index: number, id: string) {
    const temp = { ...sampleExpense, id: id };

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

    setAmountInput('');
    setLabelInput('');

    await syncRenderer();
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

    await syncRenderer();
    hideDeleted();
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
        <Text style={styles.item}>{label}</Text>
        <Text style={styles.item}>{amount}</Text>
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
      <Input
        label='Amount'
        leftIcon={{ type: 'font-awesome', name: 'gift' }}
        onChangeText={(text) => setAmountInput(text)}
        value={amountInput}
      />
      <Input
        label='Label'
        leftIcon={{ type: 'font-awesome', name: 'pencil' }}
        onChangeText={(text) => setLabelInput(text)}
        value={labelInput}
      />

      <YStack padding='$3' minWidth={250} alignSelf='center' gap='$2'>
        <MyButton label='Insert' onPress={() => insertExpense()} />
        <MyButton label='Sync' onPress={() => syncRenderer()} />
        <MyButton
          label='Print insert'
          onPress={() => printToInsert()}
        />
        <MyButton label='hideDelete' onPress={() => hideDeleted()} />
      </YStack>

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
    fontSize: 25,
  },
});
