import {
    BlockInfo,
    Deadline,
    LimitType,
} from "tsjs-xpx-chain-sdk";
import { AppState } from "@/state/appState";
import { Helper } from "@/util/typeHelper";
export interface BlockObj {
    height: number,
    validator: string,
    hash: string,
    difficulty: number,
    feeMultiplier : number,
    totalFee: number,
    numTransactions: number,
    timestamp: string
}

export class BlockUtils {
    
    static async getBlockByHeight(blockHeight: number): Promise<BlockObj> {
        try {
            let blockInfo: BlockObj;
            let block = await AppState.chainAPI.blockAPI.getBlockByHeight(blockHeight);
            blockInfo = {
                height: block.height.compact(),
                validator: block.signer.publicKey,
                hash: block.hash,
                difficulty: block.difficulty.compact(),
                feeMultiplier:block.feeMultiplier,
                totalFee: block.totalFee.compact(),
                numTransactions: block.numTransactions,
                timestamp: Helper.formatDeadline(block.timestamp.compact())
            }
            return blockInfo;
        } catch (error) {
            console.error(error);
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
    
}
