const provider = new WalletConnectProvider.default({
    rpc: {
        137: "https://polygon-rpc.com",
        80001: "https://rpc-mumbai.maticvigil.com"
    }
});

let web3Provider = null;
let isWalletConnected = false;
let userAddress = null;

async function connectWallet() {
    console.log("Membuka jendela WalletConnect...");
    await provider.enable();
    web3Provider = new ethers.providers.Web3Provider(provider);
    const signer = web3Provider.getSigner();
    userAddress = await signer.getAddress();
    
    console.log("✅ Dompet Terhubung:", userAddress);
    isWalletConnected = true;
    return { success: true, address: userAddress };
}

export { connectWallet, isWalletConnected, userAddress };
