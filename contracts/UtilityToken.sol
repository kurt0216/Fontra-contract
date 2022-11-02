// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./lib/ERC20.sol";

contract UtilityToken is ERC20 {

    uint256 maxSupply;    

    constructor(uint256 _maxSupply) ERC20("UtilityToken", "ULT") {        
        maxSupply = _maxSupply != 0 ? _maxSupply : type(uint256).max; 
    }

    function cap() public view returns(uint256) {
        return maxSupply;
    }

    /**
     * @dev mint token to the caller              
     * @param amount - amount of token
     */
    function mint(uint256 amount) 
    public        
    {           
        require(amount > 0, "Amount is invalid");
        require(maxSupply >= totalSupply() + amount, "Cap exceed");

        _mint(msg.sender, amount);
    }
}