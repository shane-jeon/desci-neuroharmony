// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./NEUROToken.sol";

contract NeuroGrantDAO {
    NEUROToken public neuroToken;
    
    struct Proposal {
        uint256 id;
        string description;
        uint256 budget;
        uint256 votes;
        address proposer;
        bool executed;
    }

    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;
    mapping(address => uint256) public votingPower;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event ProposalCreated(uint256 indexed id, address indexed proposer);
    event Voted(uint256 indexed id, address indexed voter, uint256 votes);
    event ProposalExecuted(uint256 indexed id);
    event VotingPowerUpdated(address indexed user, uint256 newVotingPower);

    constructor(address _neuroTokenAddress) {
        neuroToken = NEUROToken(_neuroTokenAddress);
    }

    // Function to update voting power based on staked tokens
    function updateVotingPower(address _user) public {
        uint256 stakedAmount = neuroToken.getStakedAmount(_user);
        votingPower[_user] = stakedAmount;
        emit VotingPowerUpdated(_user, stakedAmount);
    }

    // Function to create a proposal
    function createProposal(string memory _description, uint256 _budget) public {
        proposalCount++;
        proposals[proposalCount] = Proposal({
            id: proposalCount,
            description: _description,
            budget: _budget,
            votes: 0,
            proposer: msg.sender,
            executed: false
        });

        emit ProposalCreated(proposalCount, msg.sender);
    }

    // Function to check if a user has voted on a proposal
    function hasUserVoted(uint256 _proposalId, address _user) public view returns (bool) {
        return hasVoted[_proposalId][_user];
    }

    // Function to vote on a proposal
    function vote(uint256 _proposalId, uint256 _votes) public {
        require(!hasVoted[_proposalId][msg.sender], "User has already voted on this proposal");
        // Update voting power before checking
        updateVotingPower(msg.sender);
        require(votingPower[msg.sender] >= _votes, "Insufficient voting power");
        
        proposals[_proposalId].votes += _votes;
        votingPower[msg.sender] -= _votes;
        hasVoted[_proposalId][msg.sender] = true;
        emit Voted(_proposalId, msg.sender, _votes);
    }

    // Function to execute a proposal
    function executeProposal(uint256 _proposalId) public {
        require(!proposals[_proposalId].executed, "Proposal already executed");
        proposals[_proposalId].executed = true;
        emit ProposalExecuted(_proposalId);
    }

    // Function to get current voting power
    function getVotingPower(address _user) public view returns (uint256) {
        return votingPower[_user];
    }
}