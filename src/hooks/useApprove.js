/* eslint-disable react-hooks/exhaustive-deps */
import useWeb3Instance from "./useWeb3";
import ERC20ABI from "../abis/ERC20.json";
import { useCallback, useEffect, useState } from "react";
import { ERC20_ADDRESS } from "../utils/addresses";
import BigNumber from 'bignumber.js';
import { fromWei, toWei } from "../utils/helper";

export default function useApprove(spenderAddress, updateFlag) {
  const {web3Instance, account} = useWeb3Instance();
  const [allowance, setAllowance] = useState(new BigNumber(0));
  const erc20Contract = new web3Instance.eth.Contract(ERC20ABI, ERC20_ADDRESS);
  const approve = useCallback((amount) => {
    console.log("toWei(amount)",toWei(amount))
    return erc20Contract.methods.approve(spenderAddress, toWei(amount)).send({from: account});
  },[account, spenderAddress])
  useEffect(() => {
    erc20Contract.methods.allowance(account,spenderAddress)
    .call()
    .then(res => setAllowance(fromWei(res)));
  }, [account, spenderAddress, updateFlag])
  return {allowance, approve};
}