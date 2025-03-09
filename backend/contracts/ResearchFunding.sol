// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ResearchFunding {
    struct Grant {
        string title;
        string description;
        uint256 amount;
        address[] voters;
        bool isApproved;
    }

    mapping(uint256 => Grant) public grants;
    uint256 public grantCount;

    event GrantCreated(uint256 grantId, string title, uint256 amount);
    event GrantApproved(uint256 grantId);

    function createGrant(string memory _title, string memory _description, uint256 _amount) public {
        grantCount++;
        grants[grantCount] = Grant({
            title: _title,
            description: _description,
            amount: _amount,
            voters: new address[](0),
            isApproved: false
        });
        emit GrantCreated(grantCount, _title, _amount);
    }

    function voteForGrant(uint256 _grantId) public {
        require(!grants[_grantId].isApproved, "Grant already approved.");
        grants[_grantId].voters.push(msg.sender);
        if (grants[_grantId].voters.length >= 3) { // Example threshold
            grants[_grantId].isApproved = true;
            emit GrantApproved(_grantId);
        }
    }
}