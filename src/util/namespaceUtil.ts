import { AppState } from "@/state/appState";
import {
  Account,
  Address,
  AggregateTransaction,
  PublicAccount,
  MultisigCosignatoryModification,
  MultisigCosignatoryModificationType,
  AccountInfo,
  MultisigAccountInfo,
  Mosaic,
  NamespaceId,
  NamespaceInfo,
} from "tsjs-xpx-chain-sdk";
import { ChainUtils } from "./chainUtils";
import { TransactionUtils } from '@/models/util/transactionUtils';
import { Helper } from "@/util/typeHelper";
import { pushScopeId } from "vue";



export class NamespaceUtils{
  static relativeTime = (timestamp:number) => {
    let current = new Date();
    let expired = new Date(timestamp);
    let timeDiff = {
      years: expired.getFullYear() - current.getFullYear(),
      months: expired.getMonth() - current.getMonth(),
      days: expired.getDate()  - current.getDate(),
      hours: expired.getHours() - current.getHours(),
      mins: expired.getMinutes() - current.getMinutes(),
    }

    if (timeDiff.mins < 0) {
      timeDiff.hours--;
      timeDiff.mins += 60;
    }
    if (timeDiff.hours < 0) {
      timeDiff.days--;
      timeDiff.hours += 24;
    }
    if (timeDiff.days < 0) {
      timeDiff.months--;
      // days = days left in current's month,
      //   plus days that have passed in expiry's month
      const copyCurrent = new Date(current.getTime());
      copyCurrent.setDate(32);
      timeDiff.days = 32 - current.getDate() - copyCurrent.getDate() + expired.getDate();
    }
    if (timeDiff.months < 0) {
      timeDiff.years--;
      timeDiff.months+=12;
    }
    if(timeDiff.years > 0){
      return timeDiff.years + ' ' + 'year' + ((timeDiff.years>1)?'s':'');
    }else if(timeDiff.months > 0){
      return timeDiff.months + ' ' + 'month' + ((timeDiff.months>1)?'s':'');
    }else if(timeDiff.days > 0){
      return timeDiff.days + ' ' + 'day' + ((timeDiff.days>1)?'s':'');
    }else if(timeDiff.hours > 0){
      return timeDiff.hours + ' ' + 'hour' + ((timeDiff.hours>1)?'s':'');
    }else{
      return timeDiff.mins + ' ' + 'minute' + ((timeDiff.mins>1)?'s':'');
    }
  }
}

