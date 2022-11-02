import { useMetaMask } from 'metamask-react';
import './App.scss';
import Button from './components/Button';
import LoadingSpinner from './components/LoadingSpinner';
import Mint from './components/Mint';
import useWeb3Instance from './hooks/useWeb3';
import { ERC20_ADDRESS, ERC721_ADDRESS } from './utils/addresses';

const GOERLI = "0x5";
function App() {
  const {status, connectWallet, chainId} = useWeb3Instance();
  const {switchChain} = useMetaMask();
  const switchNetwork = () => {
    switchChain(GOERLI);
  }
  if (chainId !== GOERLI) {
    return (
      <div className="App">
        <h2>Wrong Network. Only available on Goerli Test net</h2>
        <Button onClick={switchNetwork}>Switch Network</Button>
      </div>
    )
  }
  const renderWalletButton = () => {
    switch (status) {
      case "initializing":
        return (
          <LoadingSpinner />
        );

      case "notConnected":
        return (
          <div className="connect-wallet">
            <Button 
              color="fantra"
              title="Click to connect wallet"
              onClick={connectWallet}
            >
              Connect Wallet
            </Button>
          </div>
        );

      case "connecting":
        return (
          <LoadingSpinner/>
        );

      case "connected":
        return (
          <Mint/>
        );
      default:
        return <div>Metamask unavailable</div>;
    }
  }

  return (
    <div className="App">
      <h1>Fantera Collection</h1>
      <h3>
        Only available Goerli test network(5)
      </h3>
      <div>
        Token(FANT) address: {ERC20_ADDRESS}
      </div>
      <div>
        Collection(FANTC) address: {ERC721_ADDRESS}
      </div>
      
      {renderWalletButton()}
    </div>
  );
}

export default App;
