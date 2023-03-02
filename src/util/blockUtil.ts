import type { BlockInfo } from "tsjs-xpx-chain-sdk";
import { AppState } from "@/state/appState";
import { Helper } from "@/util/typeHelper";
export interface BlockObj {
  height: number;
  validator: string;
  hash: string;
  difficulty: number;
  feeMultiplier: number;
  totalFee: number;
  numTransactions: number;
  timestamp: string;
}

export class BlockUtils {
  static async getBlockByHeight(blockHeight: number): Promise<BlockObj> {
    if (!AppState.chainAPI) {
      throw new Error("Service Unavailable");
    }
    try {
      const block = await AppState.chainAPI.blockAPI.getBlockByHeight(
        blockHeight
      );
      const blockInfo: BlockObj = {
        height: block.height.compact(),
        validator: block.signer.publicKey,
        hash: block.hash,
        difficulty: block.difficulty.compact(),
        feeMultiplier: block.feeMultiplier,
        totalFee: block.totalFee.compact(),
        numTransactions: block.numTransactions,
        timestamp: Helper.formatDeadline(block.timestamp.compact()),
      };
      return blockInfo;
    } catch (error) {
      throw error;
    }
  }

  static async getBlocksList(blockHeight?: number): Promise<BlockInfo[]> {
    if (!AppState.chainAPI) {
      throw new Error("Service Unavailable");
    }
    let blockInfo: BlockInfo[] = [];
    // let limitType: LimitType;
    if (blockHeight == null) {
      const height =
        await AppState.chainAPI.diagnosticAPI.getDiagnosticStorage();
      blockHeight = height.numBlocks;
    }

    const blockInfoByHeight =
      await AppState.chainAPI.blockAPI.getBlocksByHeightWithLimit(
        blockHeight,
        100
      );
    if (blockInfoByHeight.length < 100) {
      const getPreviousBlockByHeight =
        await AppState.chainAPI.blockAPI.getBlocksByHeightWithLimit(
          blockHeight - blockInfoByHeight.length
        );
      const totalHeight: number = 100 - blockInfoByHeight.length;
      const getSlicedBlock: BlockInfo[] = getPreviousBlockByHeight.slice(
        0,
        totalHeight
      );
      blockInfo = blockInfoByHeight.concat(getSlicedBlock);
    } else {
      blockInfo = blockInfoByHeight;
    }
    return blockInfo;
  }
}
