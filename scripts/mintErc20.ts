import * as ethers from "ethers";
import * as dotenv from "dotenv";
import { expandDecimals, waitForTx } from "./helper";

dotenv.config();

const UtilityContract = require("../artifacts/contracts/UtilityToken.sol/UtilityToken.json");
const utilityContract = "0xfE80eaD411bd6aC38489Bf60Aa212009Bdd3F118";

const amount: number = 1000;

const main = async () => {
    const provider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || "", provider);
  
    const utilityInstance = new ethers.Contract(
      utilityContract,
      UtilityContract.abi,
      wallet
    );

    // const mintTx = await utilityInstance.mint(expandDecimals(amount));
    // console.log("Add Item transaction hash", mintTx.hash);    
};

main()
  .then()
  .catch((e) => {
    console.log("catch", e);
  });
