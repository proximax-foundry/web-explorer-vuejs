import { AliasNamespace } from "@/models/transactions/aliasNamespace";

export interface SDA{
    id: string;
    sendWithAlias?: AliasNamespace;
    currentAlias?: AliasNamespace[];
    amount: number;
    divisibility: number;
    amountIsRaw: boolean;
    sendWithNamespace: boolean;
}