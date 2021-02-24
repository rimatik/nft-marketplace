// SPDX-License-Identifier: MIT
pragma solidity ^0.6.2;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract BasketballPlayer is ERC1155  {
    //add metadata api url
    constructor() public ERC1155("https://basketball-players.com/api/token/{id}.json") 
    {
    }

    function mintPlayer(address account, uint256 id, uint256 amount) public{
        _mint(account,id,amount,"");
    }
}