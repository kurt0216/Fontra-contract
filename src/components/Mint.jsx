import React from 'react'
import { useState } from 'react'
import Button from './Button'
import LoadingSpinner from './LoadingSpinner';
import MintForm from './MintForm';

import useApprove from '../hooks/useApprove';
import useBalance from '../hooks/useBalances';
import useMintErc20 from '../hooks/useMintErc20';
import { ERC721_ADDRESS } from '../utils/addresses';

let forceUpdate = 0;
export default function Mint() {
  const [showUploader, setShowUploader] = useState(false);
  const [approving, setApproving] = useState(false);
  const [minting, setMinting] = useState(false);

  const {mintErc20 : mintErc20Token} = useMintErc20();
  const {balance, collectionBalance} = useBalance(forceUpdate);
  const {allowance, approve} = useApprove(ERC721_ADDRESS, forceUpdate);
  const getToken = () => {
    setMinting(true);
    mintErc20Token(1000)
    .then(() => {
      setMinting(false); 
      forceUpdate++;
    })
    .catch(() => setMinting(false));;
  }
  const approveToken = () => {
    setApproving(true);
    approve(1000)
      .then(() => {
        setApproving(false); 
        forceUpdate++;
      })
      .catch(() => setApproving(false));
  }
  const completeMint = () => {
    setShowUploader(false);
    forceUpdate ++;
  }
  return (
    <div className='mint'>
      <div>
        FANT(Fantera Token) : {balance}
      </div>
      <div>
        FANTC(Fantera Collection) : {collectionBalance}
      </div>

      <div className='action-bar'>
        {!minting && <Button
          title="Click to obtain FANT token"
          onClick={getToken}
          icon="prefix-icon"
        >
          Obtain 1000 FANT
        </Button>}
        {minting && <Button
          title="Click to obtain FANT token"
          icon="prefix-icon"
          disabled
        >
          Confirming <LoadingSpinner/>
        </Button>}
       
        {Number(allowance) < 100 ? <Button
            title="Click to disconnect wallet"
            onClick={approving?()=>{}:approveToken}
            icon="prefix-icon"
          >
            {approving?"Confirming transaction...":"Approve FANT(1000)"}
            {approving && <LoadingSpinner/>}
          </Button>:<Button
            title="Click to disconnect wallet"
            onClick={() => setShowUploader(!showUploader)}
            icon="prefix-icon"
          >
            Mint with 100 FANT
          </Button>}
      </div>
      <div className='input-area'>
        
      </div>
      {showUploader && <MintForm onCompleted={completeMint} />}
    </div>
  )
}
