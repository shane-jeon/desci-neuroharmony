// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ResearchCollaboration {
    struct Project {
        string title;
        string description;
        address[] contributors;
        string[] documents; // IPFS hashes for documents
        bool isCompleted;
    }

    mapping(uint256 => Project) public projects;
    uint256 public projectCount;

    event ProjectCreated(uint256 projectId, string title, address creator);
    event DocumentAdded(uint256 projectId, string documentHash);

    function createProject(string memory _title, string memory _description) public {
        projectCount++;
        projects[projectCount] = Project({
            title: _title,
            description: _description,
            contributors: new address[](0),
            documents: new string[](0),
            isCompleted: false
        });
        projects[projectCount].contributors.push(msg.sender);
        emit ProjectCreated(projectCount, _title, msg.sender);
    }

    function addContributor(uint256 _projectId, address _contributor) public {
        require(!projects[_projectId].isCompleted, "Project is completed.");
        projects[_projectId].contributors.push(_contributor);
    }

    function addDocument(uint256 _projectId, string memory _documentHash) public {
        require(!projects[_projectId].isCompleted, "Project is completed.");
        projects[_projectId].documents.push(_documentHash);
        emit DocumentAdded(_projectId, _documentHash);
    }

    function completeProject(uint256 _projectId) public {
        projects[_projectId].isCompleted = true;
    }
}