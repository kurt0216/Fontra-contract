import React, { useReducer, useState } from 'react'
import useMintNFT from '../hooks/useMintNFT';
import { pinToIPFS } from '../utils/post';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';

const initialState = {
  name: "",
  description: "",
  file: null,
  uri: ""
};

function reducer(state, action) {
  switch (action.type) {
    case 'setName':
      return {...state, name: action.payload};
    case 'setDescription':
      return {...state, description: action.payload};
    case 'setFile':
      return {...state, file: action.payload};
    case 'setUri':
      return {...state, uri: action.payload}
    case 'init': 
      return {...initialState}
    default:
      throw new Error();
  }
}

export default function MintForm({onCompleted}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [fileImg, setFileImg] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const {mintErc721, minting} = useMintNFT()

  const sendFileToIPFS = async (e) => {
    e.preventDefault()
    if (fileImg) {
      try {
        const formData = new FormData();
        formData.append("file", fileImg);
        setUploading(true);
        const resFile = await pinToIPFS(formData);
        const imageHash = `ipfs://${resFile.data.IpfsHash}`;
        dispatch({type: 'setUri', payload: imageHash});
        sendMetadataToIPFS({
          name: state.name,
          description: state.description,
          uri: imageHash
        });
      } catch (error) {
        console.log("Error sending File to IPFS: ");
        console.log(error);
        setUploading(false);
      }
    }
  }
  const sendMetadataToIPFS = async(mataData) => {
    const formData = new FormData();
    const uploadData = JSON.stringify(mataData);
    formData.append("file", new Blob([uploadData], {
      type: 'application/json'
    }));
    const metafile = await pinToIPFS(formData);
    const metahash = `ipfs://${metafile.data.IpfsHash}`;
    setUploading(false);
    mintErc721(metahash,
      () => {
        dispatch({type: "init"})
        if (onCompleted) onCompleted()
      },
    )
  }
  return (
    <div className="mint-form">
      UploadFile
      <form onSubmit={sendFileToIPFS}>
        <label>Name</label>
        <input type="text" value={state.name} onChange={e=>dispatch({type:"setName", payload: e.target.value})}/>
        <label>Description</label>
        <textarea value={state.description} onChange={e=>dispatch({type:"setDescription", payload: e.target.value})}/>
        <label>File</label>
        <input type="file" onChange={(e) =>setFileImg(e.target.files[0])} required />
        {minting && <Button>Confimring transaction...<LoadingSpinner/></Button>}            
        {uploading && <Button>Uploading image to IPFS...<LoadingSpinner/> </Button>}
        {!minting && !uploading && <Button type="submit">Mint</Button>}
      </form>
    </div>
  )
}
