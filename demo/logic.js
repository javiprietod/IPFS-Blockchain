let web3;
let contract;

const contractAddress = '0x85b60fD76598f0E871e39dC7A7142fD9c1a2bB55';
const contractABI = [
{
    "anonymous": false,
    "inputs": [
        {
            "indexed": false,
            "internalType": "string",
            "name": "ipfsHash",
            "type": "string"
        },
        {
            "indexed": false,
            "internalType": "address",
            "name": "uploader",
            "type": "address"
        },
        {
            "indexed": false,
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
        }
    ],
    "name": "FileUploaded",
    "type": "event"
},
{
    "inputs": [
        {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }
    ],
    "name": "files",
    "outputs": [
        {
            "internalType": "string",
            "name": "ipfsHash",
            "type": "string"
        },
        {
            "internalType": "address",
            "name": "uploader",
            "type": "address"
        },
        {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
        }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
        {
            "internalType": "uint256",
            "name": "index",
            "type": "uint256"
        }
    ],
    "name": "getFile",
    "outputs": [
        {
            "internalType": "string",
            "name": "",
            "type": "string"
        },
        {
            "internalType": "address",
            "name": "",
            "type": "address"
        },
        {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [],
    "name": "getTotalFiles",
    "outputs": [
        {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
        {
            "internalType": "string",
            "name": "_ipfsHash",
            "type": "string"
        }
    ],
    "name": "uploadFile",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}
];

window.addEventListener('load', async () => {
    if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    contract = new web3.eth.Contract(contractABI, contractAddress);
    } else {
    alert('Please install MetaMask!');
    }
});

async function upload() {
    const file = document.getElementById('fileInput').files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('http://10.0.0.196:3000/upload', {
        method: 'POST',
        body: formData
        });

        const data = await response.json();
        const cid = data.cid;

        document.getElementById('output').innerHTML = `Last CID uploaded: <a href="https://ipfs.io/ipfs/${cid}" target="_blank">${cid}</a>`;
        const accounts = await web3.eth.getAccounts();
        await contract.methods.uploadFile(cid).send({ from: accounts[0] });

        alert('CID stored on blockchain!');
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('output').innerText = 'Upload failed.';
    }
}

async function showFiles() {
    const output = document.getElementById('fileList');
    output.innerHTML = 'Loading files...';

    try {
        const total = await contract.methods.getTotalFiles().call();
        if (total == 0) {
        output.innerHTML = 'No files uploaded yet.';
        return;
        }

        let html = `<p>Total Files: ${total}</p><ul>`;
        for (let i = 0; i < total; i++) {
            const file = await contract.methods.getFile(i).call();
            const cid = file[0];
            const uploader = file[1];
            const timestamp = file[2];

        const date = new Date(timestamp * 1000).toLocaleString();

        html += `<li>
            <a href="https://ipfs.io/ipfs/${cid}" target="_blank">${cid}</a><br>
            Uploaded by: ${uploader}<br>
            Date: ${date}
        </li><br>`;
        }
        html += '</ul>';
        output.innerHTML = html;
    } catch (error) {
        console.error('Error retrieving files:', error);
        output.innerHTML = 'Failed to load file list.';
    }
}
