import { supabase } from "@/lib/supabase";
import {
  localExpenses,
  toInsertExpenses,
  toUpdateExpenses,
  userAuth,
} from "@/lib/store";
import { Session, User } from '@supabase/supabase-js';

export interface ExpenseFormat {
    id: string;
    label: string;
    amount: number;
    auth_id: string;
    created_at: string;
    deleted_at: string | null;
  }

  export const syncExpense =  async () => {
    const session = userAuth.getState().currSession;
    
    if (session && session.user) {
    console.log("syncing expenses");

      const updateCurrent = toUpdateExpenses.getState().expense;
      const insertCurrent = toInsertExpenses.getState().expense;
      let resultCurrent = [];
      //try to upload the tosync entries to supabase

        for (const entry of insertCurrent) {
          const { error } = await supabase.from("Expenditure").insert({
            label: entry.label,
            amount: entry.amount,
            auth_id: session.user.id,
          });

          if (error) {
            console.log(error);
            resultCurrent.push(entry);
          } else {
            console.log("worked well!");
          }
        }
        toInsertExpenses.setState({ expense: resultCurrent });
      
      resultCurrent = [];
      for (const entry of updateCurrent) {
        const { error } = await supabase
          .from("Expenditure")
          .update({
            label: entry.label,
            amount: entry.amount,
            auth_id: session.user.id,
            date_deleted: entry.deleted_at
          })
          .eq("id", entry.id);

        if (error) {
          console.log(error);
          resultCurrent.push(entry);
        } else {
          console.log("worked well!");
        }
      }
      toUpdateExpenses.setState({ expense: resultCurrent });

      // pull from database
      const { data, error } = await supabase
        .from("Expenditure")
        .select()
        .eq("auth_id", session.user.id)
        .is("date_deleted", null);


      if (error) {
        console.log(error);
      } else {
        console.log("fetched worked!");
        localExpenses.setState({ expense: data });
      }
    }
  }