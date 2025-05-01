# Decentralized File Storage with IPFS and Ethereum

This project demonstrates a simple decentralized application (dApp) that allows users to:

- Upload a file to IPFS (InterPlanetary File System),
- Store its CID (Content Identifier) on the Ethereum blockchain via a smart contract,
- View uploaded files filtered by uploader or limit.

The frontend uses HTML, JavaScript, and Web3.js; the backend uses Node.js and Express to handle IPFS uploads.

---

## 🗂️ Project Structure

```
project-root/
│
├── Solidity/
│   └── FileStorage.sol         # Smart contract for storing IPFS hashes
│
├── demo/
│   ├── index.html              # Frontend HTML interface
│   ├── logic.js                # Frontend logic using Web3.js
│   ├── server.js               # Node.js server to upload files to IPFS
│   ├── styles.css              # Styling for the web interface
│
├── .gitignore                  # Git ignore file
├── README.md                   # Project documentation

```

---

## 🔧 Prerequisites

Make sure you have the following installed:

- Node.js (v16 or newer)
- npm
- MetaMask browser extension
- IPFS daemon installed and running (go-ipfs or IPFS Desktop)
- Remix IDE for deploying the smart contract
- Ganache or a live testnet (e.g., Sepolia or Goerli)

---

## 📦 Installation & Setup

1. Clone the repository:

```bash
git clone https://github.com/javiprietod/IPFS-Blockchain.git
cd IPFS-Blockchain/demo
```

2. Install dependencies:

```bash
npm install express multer cors ipfs-http-client
```

3. Start IPFS locally:

Make sure your IPFS daemon is running. If you have IPFS Desktop installed, you can simply launch it. If not, install and run:

```bash
ipfs daemon
```

4. Start the backend server:

```bash
node server.js
```

The server will run on:  
http://10.239.24.24:3000 (or update the IP in logic.js and server.js if needed)

---

## 🧠 Smart Contract Deployment (using Remix)

1. Open https://remix.ethereum.org
2. Create and paste the contents of FileStorage.sol.
3. Compile the contract.
4. Connect Remix to MetaMask via “Injected Provider”.
5. Deploy the contract and copy the deployed address.
6. Replace the contract address in logic.js:

```js
const contractAddress = 'YOUR_DEPLOYED_CONTRACT_ADDRESS';
```

---

## 🌐 Running the Frontend

Simply open index.html in a web browser (served from public/ if desired).  
Ensure MetaMask is connected to the same network where you deployed the contract.

You can:

- Upload files
- View all files uploaded
- Filter uploads by address or limit

---

## 📥 API Endpoint

Your server exposes a single upload endpoint:

```
POST /upload
Content-Type: multipart/form-data
Body: file=<uploaded file>
Response: { "cid": "<ipfs-hash>" }
```

Used by logic.js to obtain the IPFS hash and then store it via the contract.

---

## ✅ Features

- Upload files to IPFS
- Store IPFS CIDs (hashes) immutably on Ethereum blockchain
- View all uploaded files
- Filter files by uploader address or number of results

---

## ⚠️ Notes

- File contents are public unless encrypted before upload
- Files are stored on IPFS, not the blockchain
- This is a prototype meant for learning and demonstration

---

## 📝 License

Built for academic purposes.
