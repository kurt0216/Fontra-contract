// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./lib/ERC721.sol";
import "./lib/ERC721Enumerable.sol";
import "./lib/ERC721URIStorage.sol";
import "./lib/Ownable.sol";
import "./UtilityToken.sol";

contract Collection is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    UtilityToken private token;
    uint256 public depositAmt;

    event Claimed(address to, uint256 amount);
    event Minted(address to, uint256 tokenId, string uri, uint256 amount);
    

    constructor(UtilityToken _token) ERC721("Collection", "CLT") {
        token = _token;
    }

    /**
     * @dev mint NFT after receiving erc20 token     
     * @param tokenId - the token id
     * @param uri - token uri
     * @param amount - amount of erc20 token
     */
    function safeMint(uint256 tokenId, string memory uri, uint256 amount)
        public        
    {           
        require(amount > 0, "Invalid amount");
        require(bytes(uri).length > 0, "Invalid uri");


        token.transferFrom(msg.sender, address(this), amount);
        depositAmt += amount;

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);

        emit Minted(msg.sender, tokenId, uri, amount);
    }    

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    /**
     * @dev get the token URI
     * @param tokenId - The token Id
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @dev withdraw token from contract to treasury
     * @param to - treasury address
     * @param amount - amount of erc20 token
    */
    function claim (address to, uint256 amount)
        public
        onlyOwner
    {
        
        require(to != address(0), "Invalid address");
        require(amount != 0 && amount <= depositAmt, "Invalid deposit amount");

        depositAmt -= amount;
        token.transfer(to, amount);

        emit Claimed(to, amount);
    }
}