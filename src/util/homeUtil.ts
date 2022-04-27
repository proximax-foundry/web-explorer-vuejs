import {
    BlockInfo,
    BlockchainStorageInfo,
} from "tsjs-xpx-chain-sdk";
import { ChainUtils } from "./chainUtils";
import { networkState } from '@/state/networkState';
import { ChainAPICall } from "@/models/REST/chainAPICall";
import { computed } from "vue";
import { AppState } from "@/state/appState";



export class HomeUtils {
    static async getDiagnosticStorage(): Promise<BlockchainStorageInfo|false> {
        try {
            let blockChainStorageInfo = await AppState.chainAPI.diagnosticAPI.getDiagnosticStorage();
            return blockChainStorageInfo;
        } catch (error) {
            //console.log(error);            
            return false;
        }
       
    }

    static async getBlocksByHeightWithLimit(height: number): Promise<BlockInfo[] | false> {
        try {
            let blockInfo: BlockInfo[] = [];
            let blockInfoByHeight = await AppState.chainAPI.blockAPI.getBlocksByHeightWithLimit(height);
        
            if (blockInfoByHeight.length > 10) {
                blockInfo = blockInfoByHeight.slice(0, 10);
            } else {
                if (blockInfoByHeight.length < 10) {
                    let getPreviousBlockByHeight = await AppState.chainAPI.blockAPI.getBlocksByHeightWithLimit(height - blockInfoByHeight.length);
                    let totalHeight: number = 10 - blockInfoByHeight.length;
                    let getSlicedBlock: BlockInfo[] = getPreviousBlockByHeight.slice(0, totalHeight);
                    blockInfo = blockInfoByHeight.concat(getSlicedBlock);
                } else {
                    blockInfo = blockInfoByHeight;
                }
            }
            return blockInfo;
        } catch (error) {
            return false;
        }
    }

    static countDuration = (timestamp:number):string => {
        let trxDuration = "";
        const current = new Date();
        const blockTimestamp = new Date(timestamp);
        const getSeconds = Math.floor((current.getTime() - blockTimestamp.getTime()) / 1000);    
        
        if (getSeconds < 60) { 
            let second = " s";
            trxDuration = (getSeconds < 1 ? 1 :getSeconds) + second;
        } else {
            let minutes = "";
            let getMinutes = Math.floor(getSeconds / 60);
            if (getMinutes > 60) {
                let hour = "";
                let getHour = Math.floor(getMinutes / 60);
                if (getHour < 24) {
                    hour = getHour > 1 ? " hrs" : " hr";
                    trxDuration = getHour + hour;
                } else {
                    let day = "";
                    let getDay = Math.floor(getHour / 24);
                    day = getDay > 1 ? " day" : " days";
                    trxDuration = getDay + day;
                }
            } else {
                minutes = getMinutes > 1 ? " mins" : " min";
                trxDuration = getMinutes + minutes;
            }
        }
        return trxDuration;
    };

   
}