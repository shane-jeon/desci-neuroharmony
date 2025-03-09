// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ScienceToken is ERC20 {
    address public admin;

    constructor() ERC20("ScienceToken", "SCI") {
        admin = msg.sender;
        _mint(msg.sender, 1000000 * 10 ** decimals()); // Initial supply
    }

    function rewardContributor(address _contributor, uint256 _amount) public {
        require(msg.sender == admin, "Only admin can reward contributors.");
        _mint(_contributor, _amount);
    }
}