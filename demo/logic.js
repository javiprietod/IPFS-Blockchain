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
        const response = await fetch('http://10.239.24.24:3000/upload', {
        method: 'POST',
        body: formData
        });

        const data = await response.json();
        const cid = data.cid;
        document.getElementById('output').innerHTML = `Loading... <div id="loading"></div>`;
        
        const accounts = await web3.eth.getAccounts();
        await contract.methods.uploadFile(cid).send({ from: accounts[0] });
        
        document.getElementById('output').innerHTML = `Last CID uploaded to IPFS and stored in the blockchain: <a href="https://ipfs.io/ipfs/${cid}" target="_blank">${cid}</a>`;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('output').innerText = 'Upload failed.';
    }
}

async function showFiles({address=null, limit=null}) {
    const output = document.getElementById('fileList');
    if (limit === true) {
        if (address === true) {

            limit = document.getElementById('limitAddress').value;
        } else {
            limit = document.getElementById('limit').value;
        }
    }
    if (address === true) {
        address = document.getElementById('address').value;
    }
    if (address === null) {
        address = '0x'
    }
    document.getElementById('output').innerHTML = 'Loading files...<div id="loading"></div>';

    try {
        const total = await contract.methods.getTotalFiles().call();
        if (total == 0) {
        output.innerHTML = 'No files uploaded yet.';
        return;
        }
        if (limit === null){
            limit = Number(total)
        }

        let matches = [];

        let html = ``;
        for (let i = total-1; i >= 0 && matches.length < limit; i--) {
            const file = await contract.methods.getFile(i).call();
            const cid = file[0];
            const uploader = file[1];
            const timestamp = file[2];
            console.log(i)
            console.log("uploader:" + uploader)
            console.log("address:" + address)
            if ((address === '0x') || (uploader.toLowerCase() === address.toLowerCase())) {
                matches.push(file);
                console.log(address === null)
                console.log((uploader.toLowerCase() === address.toLowerCase()))
                const date = new Date(timestamp * 1000).toLocaleString();
    
                html += `<li>
                    <a href="https://ipfs.io/ipfs/${cid}" target="_blank">${cid}</a><br>
                    Uploaded by: ${uploader}<br>
                    Date: ${date}
                </li><br>`;
            }

        }
        html += '</ul>';
        document.getElementById('output').innerHTML = `<p>${matches.length} files fetched.</p><ul>`;
        output.innerHTML = html;
    } catch (error) {
        console.error('Error retrieving files:', error);
        output.innerHTML = 'Failed to load file list. Try connecting to MetaMask and reloading';
    }
}
