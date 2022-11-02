import useWeb3Instance from "./useWeb3";
import ERC20ABI from "../abis/ERC20.json";
import ERC721ABI from "../abis/ERC721.json";
import { useEffect, useState } from "react";
import { ERC20_ADDRESS, ERC721_ADDRESS } from "../utils/addresses";
import { fromWei } from "../utils/helper";

export default function useBalance(status) {
  const {web3Instance, account} = useWeb3Instance();
  const [balance, setBalance] = useState("0");
  const [collectionBalance, setCollectionBalance] = useState("0");
  const erc20Contract = new web3Instance.eth.Contract(ERC20ABI, ERC20_ADDRESS);
  const erc721Contract = new web3Instance.eth.Contract(ERC721ABI, ERC721_ADDRESS)
  useEffect(() => {
    erc20Contract.methods.balanceOf(account)
      .call()
      .then(res => setBalance(fromWei(res)));
    erc721Contract.methods.balanceOf(account)
      .call()
      .then(res => setCollectionBalance(res))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, status])
 
  return {balance, collectionBalance};
}