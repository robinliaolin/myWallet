import Web3 from 'web3';
// import HDWalletProvider from 'truffle-hdwallet-provider';

let web3;
if(typeof window !=='undefined'  && typeof window.web3 !=='undefined'){
    web3 = new Web3(window.web3.currentProvider);
}
else {
    web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/0a12e56321594355b0c928b3a19c11cb"))
}
// const mecnonic = localStorage.getItem("mecnonic");
// const infuraId = "https://rinkeby.infura.io/v3/0a12e56321594355b0c928b3a19c11cb";
// const provider = new HDWalletProvider(mecnonic,infuraId);
// web3 = new Web3(provider);
// web3.sha3()


export default web3;