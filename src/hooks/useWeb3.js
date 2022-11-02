import { useMetaMask } from "metamask-react";
import { useMemo } from "react";
import Web3 from 'web3';

export default function useWeb3Instance() {
  const { account, chainId, status, connect } = useMetaMask();
  const web3Instance = useMemo(
    () => {
      return new Web3(Web3.givenProvider)
    },[]);
  return { web3Instance, account, chainId, status, connectWallet: connect };
}
