import {
    BlockInfo,
    Deadline,
    LimitType,
} from "tsjs-xpx-chain-sdk";
import { AppState } from "@/state/appState";

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
            let blockInfo: BlockObj;
            let block = await AppState.chainAPI.blockAPI.getBlockByHeight(blockHeight);
            blockInfo = {
                height: block.height.compact(),
                validator: block.signer.publicKey,
                hash: block.hash,
                difficulty: block.difficulty.compact(),
                totalFee: block.totalFee.compact(),
                numTransactions: block.numTransactions,
                timestamp: this.fmtTime(block.timestamp.compact())
            }
            return blockInfo;
        } catch (error) {
            return false;
        }
    }

    static async getBlocksList(blockHeight?:number): Promise<BlockInfo[]> {
        let blockInfo: BlockInfo[] = [];
        if (blockHeight == null) {
            let height = await AppState.chainAPI.diagnosticAPI.getDiagnosticStorage();
            blockHeight = height.numBlocks;
        }
        
        let blockInfoByHeight = await AppState.chainAPI.blockAPI.getBlocksByHeightWithLimit(blockHeight, LimitType.N_100);
        if (blockInfoByHeight.length < 100) {
            let getPreviousBlockByHeight = await AppState.chainAPI.blockAPI.getBlocksByHeightWithLimit(blockHeight - blockInfoByHeight.length);
            let totalHeight: number = 100 - blockInfoByHeight.length;
            let getSlicedBlock: BlockInfo[] = getPreviousBlockByHeight.slice(0, totalHeight);
            blockInfo = blockInfoByHeight.concat(getSlicedBlock);            
        }
        else {
            blockInfo = blockInfoByHeight;
        }
        
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
