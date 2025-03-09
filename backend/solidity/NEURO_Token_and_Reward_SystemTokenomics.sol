// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NEUROToken is ERC20, Ownable {
    mapping(address => uint256) public rewards;
    mapping(address => uint256) public stakedTokens;

    event Rewarded(address indexed user, uint256 amount);
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);

    constructor() ERC20("NEURO Token", "NEURO") {}

    // Function to reward users
    function rewardUser(address user, uint256 amount) public onlyOwner {
        _mint(user, amount);
        rewards[user] += amount;
        emit Rewarded(user, amount);
    }

    // Function to stake tokens
    function stake(uint256 amount) public {
        _transfer(msg.sender, address(this), amount);
        stakedTokens[msg.sender] += amount;
        emit Staked(msg.sender, amount);
    }

    // Function to unstake tokens
    function unstake(uint256 amount) public {
        require(stakedTokens[msg.sender] >= amount, "Insufficient staked tokens");
        _transfer(address(this), msg.sender, amount);
        stakedTokens[msg.sender] -= amount;
        emit Unstaked(msg.sender, amount);
    }
}