import * as ethers from "ethers";
import * as dotenv from "dotenv";
import { expandDecimals, waitForTx } from "./helper";

dotenv.config();

async function main() {  
  const provider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || "", provider);
  
  const UtilityContract = require("../artifacts/contracts/FantraToken.sol/FantraToken.json");  
  const CollectionContract = require("../artifacts/contracts/FantraCollection.sol/FantraCollection.json");  

  const FantraTokenfactory = new ethers.ContractFactory(UtilityContract.abi, UtilityContract.bytecode, wallet);
  const token = await FantraTokenfactory.deploy(0);

  console.log("FantraToken is deployed -> address: ", token.address);  

  const CollectionFactory = new ethers.ContractFactory(CollectionContract.abi, CollectionContract.bytecode, wallet);
  const collection = await CollectionFactory.deploy(token.address);

  console.log("FantraCollection is deployed -> address: ", collection.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })