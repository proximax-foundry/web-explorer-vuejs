import {
    BlockInfo,
    Deadline,
    LimitType,
} from "tsjs-xpx-chain-sdk";
import { ChainUtils } from "./chainUtils";
import { networkState } from '@/state/networkState';
import { ChainAPICall } from "@/models/REST/chainAPICall";

export interface BlockObj {
    height: number,
    validator: string,
    hash: string,
    difficulty: number,
    totalFee: number,
    numTransactions: number,
    timestamp: string
}

export class BlockUtils {
    
    static async getBlockByHeight(blockHeight: number): Promise<BlockObj | boolean> {
        try {
            let chainRESTCall = new ChainAPICall(ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile?.httpPort));
            let blockInfo: BlockObj;
            let block = await chainRESTCall.blockAPI.getBlockByHeight(blockHeight);
            let timestamp = new Date(block.timestamp.compact() + Deadline.timestampNemesisBlock * 1000);
            blockInfo = {
                height: block.height.compact(),
                validator: block.signer.publicKey,
                hash: block.hash,
                difficulty: block.difficulty.compact(),
                totalFee: block.totalFee.compact(),
                numTransactions: block.numTransactions,
                timestamp: this.fmtTime(block.timestamp.compact())
            }
            console.log(blockInfo);
            return blockInfo;
        } catch (error) {
            return false;
        }
    }

    static async getBlocksList(): Promise<BlockInfo[]> {
        let chainRESTCall = new ChainAPICall(ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile?.httpPort));
        let blockInfo: BlockInfo[] = [];
        //let sortNumber: LimitType;
        // if (limitType == 25 || limitType == 0) {
        //     sortNumber = LimitType.N_25;
        // } else{
        //     sortNumber = LimitType.N_50;
        // } 
        // else if(limitType == 100) {
        //     sortNumber = LimitType.N_75;
        // } else {
        //     sortNumber = LimitType.N_100;
        // } 
        let height = await chainRESTCall.diagnosticAPI.getDiagnosticStorage();
        let blockInfoByHeight = await chainRESTCall.blockAPI.getBlocksByHeightWithLimit(height.numBlocks, LimitType.N_100);
        if (blockInfoByHeight.length < 100) {
                let getPreviousBlockByHeight = await chainRESTCall.blockAPI.getBlocksByHeightWithLimit(height.numBlocks - blockInfoByHeight.length);
                let totalHeight: number = 100 - blockInfoByHeight.length;
                let getSlicedBlock: BlockInfo[] = getPreviousBlockByHeight.slice(0, totalHeight);
                blockInfo = blockInfoByHeight.concat(getSlicedBlock);
            
            // getPreviousBlockByHeight[1].height;
            // getPreviousBlockByHeight[1].hash;
            // getPreviousBlockByHeight[1].timestamp;
             getPreviousBlockByHeight[1].type;
            getPreviousBlockByHeight[1].signer.address.plain();

            // getPreviousBlockByHeight[1].numTransactions;
            // getPreviousBlockByHeight[1].totalFee;


            } else {
                blockInfo = blockInfoByHeight;
        }
        console.log("blockUtils");
        console.log(blockInfo);
        
        return blockInfo;
    }

    private static fmtTime(timestamp:number): string {
        let dateFormat = new Date(timestamp+ Deadline.timestampNemesisBlock * 1000)
        let date = new Date(dateFormat);
            let day = (date.getDate() < 10) ? "0" + date.getDate() : date.getDate();
            let month = ((date.getMonth() + 1) < 10) ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
            let hours = (date.getHours() < 10) ? "0" + date.getHours() : date.getHours();
            let minutes = (date.getMinutes() < 10) ? "0" + date.getMinutes() : date.getMinutes();
            let seconds = (date.getSeconds() < 10) ? "0" + date.getSeconds() : date.getSeconds();
            let final = date.getFullYear() + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
        return final;
    }
}
