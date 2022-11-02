import { useCallback, useState } from "react";
import { ERC721_ADDRESS } from "../utils/addresses";
import useWeb3Instance from "./useWeb3";
import ERC721ABI from "../abis/ERC721.json";
import Web3 from "web3";
const NFT_PRICE = 100;
export default function useMintNFT(){
  const {web3Instance, account} = useWeb3Instance();
  const [minting, setMinting] = useState(false);
  const [error, setError] = useState(null);
  const mintErc721 = useCallback((uri, onSuccess, onFail) => {
    const erc721Contract = new web3Instance.eth.Contract(ERC721ABI, ERC721_ADDRESS);
    setMinting(true)
    erc721Contract.methods.totalSupply().call().then(totalSupply => {
      erc721Contract.methods.safeMint(Number(totalSupply + 1), uri, Web3.utils.toWei(`${NFT_PRICE}`))
      .send({from: account})
      .on("error", (error)=> {
        setMinting(false);
        setError(error);
      })
      .then(res => {
        setMinting(false);
        if (onSuccess) onSuccess(res);
      });
    });
  },[account, web3Instance.eth.Contract])
  return {mintErc721, minting, error};
}