import { lastValueFrom } from "rxjs";
import {
  BlockHttp,
  NetworkHttp,
  LimitType,
  MerkleProofInfo,
  BlockInfo,
  Transaction,
  Statement,
} from "tsjs-xpx-chain-sdk";

export class BlockAPI {
  blockHttp: BlockHttp;

  constructor(endpoint: string, networkHttp?: NetworkHttp) {
    this.blockHttp = new BlockHttp(endpoint, networkHttp);
  }

  getBlockByHeight(height: number): Promise<BlockInfo> {
    return lastValueFrom(this.blockHttp.getBlockByHeight(height));
  }

  getBlockReceipts(height: number): Promise<Statement> {
    return lastValueFrom(this.blockHttp.getBlockReceipts(height));
  }

  getBlockTransactions(height: number): Promise<Transaction[]> {
    return lastValueFrom(this.blockHttp.getBlockTransactions(height));
  }

  getBlocksByHeightWithLimit(
    height: number,
    limitType?: LimitType
  ): Promise<BlockInfo[]> {
    return lastValueFrom(this.blockHttp
      .getBlocksByHeightWithLimit(height, limitType));
  }

  /**
   * @param height - The height of the block.
   * @param hash - The hash of the receipt statement or resolution.
   */
  getMerkleReceipts(height: number, hash: string): Promise<MerkleProofInfo> {
    return lastValueFrom(this.blockHttp.getMerkleReceipts(height, hash));
  }

  /**
   * @param height - The height of the block.
   * @param hash - The hash of the transaction.
   */
  getMerkleTransaction(height: number, hash: string): Promise<MerkleProofInfo> {
    return lastValueFrom(this.blockHttp.getMerkleTransaction(height, hash));
  }
}
