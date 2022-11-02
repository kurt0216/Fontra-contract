const ethers = require("ethers");
import { JsonRpcProvider } from "@ethersproject/providers/src.ts/json-rpc-provider";

export const expandDecimals = (amount: Number, decimals: Number = 18) => {
    return ethers.utils.parseUnits(String(amount), decimals);
  };

export const waitForTx = async (provider: JsonRpcProvider, hash: string) => {
console.log(`Waiting for tx: ${hash}...`);
while (!(await provider.getTransactionReceipt(hash))) {
    sleep(5000);
}
};

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }