// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NeuroDataProvenance {
    struct Dataset {
        string datasetId;
        string origin; // Source of the dataset (e.g., OpenNeuro, IEEG)
        string license; // License type (e.g., CC BY 4.0)
        uint256 timestamp;
        address uploader;
    }

    mapping(string => Dataset) public datasets;
    uint256 public datasetCount;

    event DatasetUploaded(string indexed datasetId, address indexed uploader, uint256 timestamp);

    // Function to upload dataset metadata
    function uploadDataset(
        string memory _datasetId,
        string memory _origin,
        string memory _license
    ) public {
        datasets[_datasetId] = Dataset({
            datasetId: _datasetId,
            origin: _origin,
            license: _license,
            timestamp: block.timestamp,
            uploader: msg.sender
        });

        datasetCount++;
        emit DatasetUploaded(_datasetId, msg.sender, block.timestamp);
    }

    // Function to retrieve dataset metadata
    function getDataset(string memory _datasetId) public view returns (Dataset memory) {
        return datasets[_datasetId];
    }
}