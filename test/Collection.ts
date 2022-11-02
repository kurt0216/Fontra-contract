import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract, BigNumber } from "ethers";
import {
    expandDecimals
} from "../scripts/helper";

const COLLECTION_NAME = "Collection";
const COLLECTION_SYMBOL = "CLT";
const TEST_URI = "https://gateway.pinata.cloud/ipfs/QmZ4bHZbhsiu5uzbgom7PVueQo16uDeQFQMEfpaxuJeRVu?filename=0000000000000000000000000000000000000000000000000000000000000001.json";

export function CollectionTest(): void {
  describe("Collection contract", function () {
    let Collection: Contract;
    let UtilityToken: Contract;
    let owner: SignerWithAddress;
    let addr1: SignerWithAddress;
    let addr2: SignerWithAddress;
    let addr3: SignerWithAddress;
    let addrs: SignerWithAddress[];

    beforeEach(async function () {      
      [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();

      const UtilityTokenContract = await ethers.getContractFactory("UtilityToken");
      const utilityToken = await UtilityTokenContract.deploy(expandDecimals(0));
      
      UtilityToken = await utilityToken.deployed();      

      const CollectionContract = await ethers.getContractFactory(
        "Collection"
      );
      const collection = await CollectionContract.deploy(UtilityToken.address);

      Collection = await collection.deployed();
    });

    describe("Deployment", function () {
      it("Should have a collection name", async function () {
        expect(await Collection.name()).to.eq(COLLECTION_NAME);
      });

      it("Should have a collection symbol", async function () {
        expect(await Collection.symbol()).to.eq(COLLECTION_SYMBOL);
      });

      it("Total supply should be zero", async function () {
        expect(await Collection.totalSupply()).to.eq(0);
      });      
    });

    describe("Ownable", function () {
      it("After deploying, the owner should be deployer", async function () {
        expect(await Collection.owner()).to.eq(owner.address);
      });

      it("Owner is able to transfer ownership", async function () {
        expect(await Collection.transferOwnership(addr1.address))
          .to.emit(Collection, "OwnershipTransferred")
          .withArgs(owner.address, addr1.address);
        expect(await Collection.owner()).to.eq(addr1.address);
      });
    });

    describe("Mint", function () {
      beforeEach(async () => {
        // mint erc20 token to users
        await UtilityToken.mint(expandDecimals(1000));        

        // approve erc20 token
        await UtilityToken.approve(Collection.address, expandDecimals(100))
      });

      it("User is able to mint NFT with deposting erc20 token", async function () {

        await expect(Collection.safeMint(0, TEST_URI, expandDecimals(100)))
          .to.emit(Collection, "Minted")
          .withArgs(owner.address, 0, TEST_URI, expandDecimals(100));

        await expect(Collection.safeMint(1, "", expandDecimals(100)))
          .to.revertedWith("Invalid uri");

        await expect(Collection.safeMint(2, TEST_URI, 0))
          .to.revertedWith("Invalid amount");
          

        expect(await Collection.totalSupply()).to.eq(1);
        expect(await Collection.balanceOf(owner.address)).to.eq(1);
        expect(await Collection.ownerOf(0)).to.eq(owner.address);  
        expect(await UtilityToken.balanceOf(owner.address)).to.eq(expandDecimals(900));      
        expect(await UtilityToken.balanceOf(Collection.address)).to.eq(expandDecimals(100));              
      });
    });

    describe("Transfer", function () {
      beforeEach(async () => {
        // mint erc20 token to users
        await UtilityToken.mint(expandDecimals(1000));        

        // approve erc20 token
        await UtilityToken.approve(Collection.address, expandDecimals(1000))

        // mint NFT with depositing erc20 token
        await Collection.safeMint(0, TEST_URI, expandDecimals(100));

        // approve NFT to transfer
        await Collection.approve(addr1.address, 0);
      });

      it("NFT Owner is able to transfer nft", async function () {        

        // transfer
        expect(
          await Collection.transferFrom(
            owner.address,
            addr1.address,
            0
          )
        )
          .to.emit(Collection, "Transfer")
          .withArgs(owner.address, addr1.address, 0);

        // after transferring
        expect(await Collection.totalSupply()).to.eq(1);
        expect(await Collection.balanceOf(owner.address)).to.eq(0);
        expect(await Collection.balanceOf(addr1.address)).to.eq(1);
        expect(await Collection.ownerOf(0)).to.eq(addr1.address);
      });
      
    });
    describe("Claim", function () {
        beforeEach(async () => {
          // mint erc20 token to users
          await UtilityToken.mint(expandDecimals(1000));        
  
          // approve erc20 token
          await UtilityToken.approve(Collection.address, expandDecimals(1000))
  
          // mint NFT with depositing erc20 token
          await Collection.safeMint(0, TEST_URI, expandDecimals(100));  
          
        });
  
        it("Collection contract Owner is able to claim deposited erc20 token", async function () {        
  
          
          await expect(
            Collection.claim(addr2.address, expandDecimals(1000))
          ).to.revertedWith("Invalid deposit amount");

          await expect(
            Collection.claim(addr2.address, 0)
          ).to.revertedWith("Invalid deposit amount");
  
          await expect(
            Collection.claim(addr2.address, expandDecimals(100))
          ).to.emit(Collection, "Claimed")
          .withArgs(addr2.address, expandDecimals(100));

          // after claiming erc20 token
          expect(await UtilityToken.balanceOf(Collection.address)).to.eq(0);
          expect(await UtilityToken.balanceOf(addr2.address)).to.eq(expandDecimals(100));
        });
        
      });
  });

  
}
