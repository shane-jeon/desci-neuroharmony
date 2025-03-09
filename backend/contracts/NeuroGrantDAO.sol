// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NeuroGrantDAO {
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

    event ProposalCreated(uint256 indexed id, address indexed proposer);
    event Voted(uint256 indexed id, address indexed voter, uint256 votes);
    event ProposalExecuted(uint256 indexed id);

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

    // Function to vote on a proposal
    function vote(uint256 _proposalId, uint256 _votes) public {
        require(votingPower[msg.sender] >= _votes, "Insufficient voting power");
        proposals[_proposalId].votes += _votes;
        votingPower[msg.sender] -= _votes;
        emit Voted(_proposalId, msg.sender, _votes);
    }

    // Function to execute a proposal
    function executeProposal(uint256 _proposalId) public {
        require(!proposals[_proposalId].executed, "Proposal already executed");
        proposals[_proposalId].executed = true;
        emit ProposalExecuted(_proposalId);
    }
}