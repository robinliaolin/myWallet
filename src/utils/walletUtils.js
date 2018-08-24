import HDWalletProvider from 'truffle-hdwallet-provider'
import Web3 from 'web3'
import web3 from '../web3'
const infuraKey = "https://rinkeby.infura.io/v3/0a12e56321594355b0c928b3a19c11cb";
const initalizeWeb3 = (mecnonic)=>{
    return new Promise( async (resolve, reject) => {
        try{
            const provider = new HDWalletProvider(mecnonic,infuraKey)
            let web3 = new Web3(provider);
            let accounts = await web3.eth.getAccounts();
            resolve(accounts);
        }catch(e){
            reject(e)
        }
    })
};
const getETHAccounts = ()=>{
    return new Promise( async (resolve, reject) => {
            try{
                let accounts = await web3.eth.getAccounts();
                console.log("目前外部账号是"+accounts[0]);
                resolve(accounts[0]);
            }catch(e){
                reject(e)
            }
        })
}
const getTransationsList = ()=>{
    return new Promise( async (resolve, reject) => {
            try{
                let currentBlockNumber = await web3.eth.getBlockNumber();
                console.log("当前区块的编号是："+currentBlockNumber);
                let blockInfo = await web3.eth.getBlock(currentBlockNumber);
                let transationHashArr = blockInfo.transactions;
                let transations = transationHashArr.map( async(val,index)=>{
                    let transationInfo = await web3.eth.getTransaction(val);
                    return transationInfo;
                })
                console.log("当前区块的信息："+blockInfo);
                resolve(transations)
                //http://api.etherscan.io/api?module=account&action=txlist&address=0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a&startblock=0&endblock=99999999&sort=asc&apikey=YourApiKeyToken
                // let url = `http://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=YourApiKeyToken`
                // fetch()
            }catch(e){
                reject(e)
            }
        })
}
const transfromValue = (from,to,value)=>{
    return new Promise( async (resolve, reject) => {
            try{
                let receipt = await web3.eth.sendTransaction({
                    from:from,
                    to:to,
                    value:value,
                    gas:"3000000"
                })
                console.log("转账交易的hash："+receipt.transactionHash);
                resolve(true);
            }catch(e){
                reject(e);
            }
        })
}
const getBalance = (address)=>{
    return new Promise( async (resolve, reject) => {
            try{
                let balance = await web3.eth.getBalance(address);
                console.log(address+"---账号的余额是："+balance);
                resolve(balance);
            }catch(e){
                reject(e)
            }
        })
}
const regetAccountFromPrikey = (priKey)=>{
    return new Promise( async (resolve, reject) => {
            try{
                let account = {};
                if(priKey.startsWith("0x")){
                    account = await web3.eth.accounts.privateKeyToAccount(priKey)
                }
                else {
                    account = await web3.eth.accounts.privateKeyToAccount("0x"+priKey);
                }
                console.log("根据私钥获取的账号："+account);
                resolve(account);
            }catch(e){
                reject(e)
            }
        })
}
export  {
    getETHAccounts,getTransationsList,getBalance,transfromValue,regetAccountFromPrikey,
}