pragma solidity ^0.6.2;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

contract MarketplaceBasketball {

    IERC1155 private _token;

    mapping(uint256 => uint256) price;

    constructor(IERC1155 token) public {
        require(address(token) != address(0));
        _token = token;
        price[1] = 100000000000000;
        price[2] = 100000000000000;
        price[3] = 100000000000000;
    }

    fallback() external payable{
        buyToken(1,1);
    }

    function buyToken(uint256 tokenId, uint256 quantity) public payable {
        uint256 weiAmount = msg.value;
        require(weiAmount >= price[tokenId] && price[tokenId] != 0);
     
        _token.safeTransferFrom(address(this), msg.sender, tokenId, quantity,"");
    }

    function onERC1155Received(address _operator, address _from, uint256 _id, uint256 _value, bytes calldata _data) external returns(bytes4){
        return bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"));
    }

}