// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FileStorage {
    struct FileRecord {
        string ipfsHash;
        address uploader;
        uint256 timestamp;
    }

    FileRecord[] public files;

    event FileUploaded(string ipfsHash, address uploader, uint256 timestamp);

    function uploadFile(string memory _ipfsHash) public {
        FileRecord memory newFile = FileRecord({
            ipfsHash: _ipfsHash,
            uploader: msg.sender,
            timestamp: block.timestamp
        });

        files.push(newFile);

        emit FileUploaded(_ipfsHash, msg.sender, block.timestamp);
    }

    function getFile(uint256 index) public view returns (string memory, address, uint256) {
        require(index < files.length, "File index out of bounds");
        FileRecord memory file = files[index];
        return (file.ipfsHash, file.uploader, file.timestamp);
    }

    function getTotalFiles() public view returns (uint256) {
        return files.length;
    }
}
