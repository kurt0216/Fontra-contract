import { BigNumber, Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import {
  expandDecimals,  
} from "../scripts/helper";
import { expect } from "chai";

const MAX_SUPPLY = 100000;
const UtilityToken_NAME = "UtilityToken";
const UtilityToken_SYMBOL= "ULT";

export function UtilityTokenTest(): void {
  describe("Token contract", function () {
    let UtilityToken: Contract;
    let owner: SignerWithAddress;
    let addr1: SignerWithAddress;
    let addr2: SignerWithAddress;
    let addrs: SignerWithAddress[];

    beforeEach(async function () {
      [owner, addr1, addr2, ...addrs] = await ethers.getSigners();  

      const UtilityTokenContract = await ethers.getContractFactory("UtilityToken");
      const utilityToken = await UtilityTokenContract.deploy(expandDecimals(MAX_SUPPLY));
      
      UtilityToken = await utilityToken.deployed();
    });

    describe("Deployment", function () {
      it("Should have a token name", async function () {
        expect(await UtilityToken.name()).to.eq(UtilityToken_NAME);
      });

      it("Should have a token symbol", async function () {
        expect(await UtilityToken.symbol()).to.eq(UtilityToken_SYMBOL);
      });

      it("Total supply Should be zero", async function () {        
        expect(await UtilityToken.totalSupply()).to.eq(0);
      });

      it("Should have a max supply", async function () {        
        expect(await UtilityToken.cap()).to.eq(expandDecimals(MAX_SUPPLY));
      });
      
    });

    describe("Mint", function () {
      it("User is able to mint the token", async function () {
        await UtilityToken.connect(addr1).mint(expandDecimals(1000));
        expect(await UtilityToken.balanceOf(addr1.address)).to.eq(expandDecimals(1000));
      });      
    });

    describe("Transfer", function () {
      it("User is able to transfer the token", async function () {
        await UtilityToken.connect(addr1).mint(expandDecimals(1000));
        await UtilityToken.connect(addr1).transfer(addr2.address, expandDecimals(1000));

        expect(await UtilityToken.balanceOf(addr2.address)).to.eq(expandDecimals(1000));
        expect(await UtilityToken.balanceOf(addr1.address)).to.eq(0);
      });
    });

    describe("Max Supply", function () {
      it("check the max supply", async function () {
        expect(await UtilityToken.cap()).to.eq(expandDecimals(MAX_SUPPLY));
      });

      it("Should mint under the max supply", async function () {
        
        await expect(
            UtilityToken.mint(expandDecimals(1000000))
        ).to.revertedWith("Cap exceed");
      });
    });
  });
}
