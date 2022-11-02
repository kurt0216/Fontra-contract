import useWeb3Instance from "./useWeb3";
import ERC20ABI from "../abis/ERC20.json";
import { useCallback } from "react";
import { ERC20_ADDRESS } from "../utils/addresses";
import Web3 from "web3";

export default function useMintErc20() {
  const {web3Instance, account} = useWeb3Instance();
  const mintErc20 = useCallback((amount) => {
    const erc20Contract = new web3Instance.eth.Contract(ERC20ABI, ERC20_ADDRESS);
    return erc20Contract.methods.mint(Web3.utils.toWei(`${amount}`))
    .send({from: account})
  },[account, web3Instance.eth.Contract])
  return {mintErc20};
}