import React,{Component} from 'react'
import {List,Image,Form,Button,TextArea} from 'semantic-ui-react'
import Web3 from 'web3';
import HDWalletProvider from "truffle-hdwallet-provider";
const infuraKey = "https://rinkeby.infura.io/v3/0a12e56321594355b0c928b3a19c11cb";
class transationList extends Component{
    constructor(props){
        super(props)
        this.state={
            account0:"",
            transations:null,
            showTransations:false,
            mecnonic:"",
            web3:{}
        }
    }
    componentDidMount(){

    }
    initalizeWeb3 = async ()=>{
        console.log("输入的助记词:"+this.state.mecnonic)
            try{
                const provider = new HDWalletProvider(this.state.mecnonic,infuraKey)
                let web3 = new Web3(provider);
                let accounts = await web3.eth.getAccounts();
                console.log(accounts)
                this.setState({
                    web3,
                    account0:accounts[0]
                })
                localStorage.setItem("mecnonic",this.state.mecnonic);
            }catch(e){
                alert("助记词错误！")
            }
    };
    searchTransactions = async()=>{
        this.initalizeWeb3();
        this.getTransationsList();

    }
    getTransationsList = async ()=>{
        const {web3} = this.state
        this.mounted = true;
        try{
            console.log("-----------1----------")
            let currentBlockNumber = await web3.eth.getBlockNumber();
            console.log("当前区块的编号是："+currentBlockNumber);
            console.log("-----------2---------")
            let blockInfo = await web3.eth.getBlock(currentBlockNumber);
            console.log("-----------3---------")
            let transationHashArr = blockInfo["transactions"];
            console.log("该区块的交易Hash列表："+transationHashArr)
            console.log("-----------4----------")
            // let transations = transationHashArr.map( async(val,index)=>{
            //     let transationInfo = await web3.eth.getTransaction(val);
            //     return transationInfo;
            // })
            console.log("当前区块的信息："+JSON.stringify(blockInfo));
            // return transations
            Promise.all(transationHashArr.map((addr, index) => this.getTransationDetail(addr)))
                .then(result => {
                    console.log("this.mounted= "+this.mounted)
                    if(!this.mounted){ return; }
                    console.log("Promise.all方法返回的结果："+result)
                    this.setState({transations: result});
                })
                .catch(e => {
                    console.error(e);
                    this.setState({transations: []});
                })
            console.log("-----------5----------");
            //http://api.etherscan.io/api?module=account&action=txlist&address=0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a&startblock=0&endblock=99999999&sort=asc&apikey=YourApiKeyToken
            // let url = `http://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=YourApiKeyToken`
            // fetch()
        }catch(e){
            alert("网络异常！")
        }
    }
    getTransationDetail = async(val)=>{
        return new Promise( async(resolve, reject) => {
            try{
                const {web3} = this.state;
                let transationInfo = await web3.eth.getTransaction(val);
                let transationInfoJson = JSON.stringify(transationInfo);
                console.log(val+"的交易信息："+transationInfoJson)
                resolve(transationInfoJson)
            }catch(e){
                reject(e)
            }
        })
    }
    getETHAccounts = async()=>{
        const {web3} = this.state;
        try{
            let accounts = await web3.eth.getAccounts();
            console.log("目前外部账号是"+accounts[0]);
            return accounts[0];
        }catch(e){
            alert("网络延迟，请重新提交")
        }
    }
    handleMecnonicChange = (e)=>{
        this.setState({
            mecnonic:e.target.value
        })
        console.log(this.state.mecnonic)
    }
    goToTransform = ()=>{
        window.location.href = "http://localhost:3000/transform"
    }
    componentWillUnmount() {
        this.mounted = false;
    }
    render(){
        const {transations,account0,showTransations} = this.state;
        let lists;
        if(transations===null||transations===[]||typeof transations === 'undefined') {
            lists = <p>列表为空</p>
        }
        else {
            lists = transations.map((val, index) => {
                let valJson = JSON.parse(val)
                let hash = valJson["hash"];
                let to = valJson["to"];
                let value = valJson["value"];
                console.log("每个交易的hash:"+hash);
                return (
                    <List.Item key={index}>
                        <List.Content >
                            <List.Header as='a'>{hash}</List.Header>
                            <List.Description>
                                对方Address:<br/>
                                {to}<br/>
                                转账金额:<br/>
                                value:{value}
                            </List.Description>
                        </List.Content>
                    </List.Item>
                )
            })
        }
        return (
            <div>
                <Form onSubmit={this.searchTransactions}>
                    <Form.Group widths='equal' >
                        <Form.Field control={TextArea} label='输入助记词查看交易' placeholder='请输入助记词'  onChange={this.handleMecnonicChange}/>
                        {/*<label>输入助记词查看交易</label>*/}
                        {/*<TextArea placeholder='请输入助记词' onChange={this.handleMecnonicChange}/>*/}
                    </Form.Group>
                    <Button type='submit'style={{width:"80%",marginLeft:"10%"}}>查看交易</Button>
                </Form>
                <br/>
                <Button type='submit' style={{width:"80%",marginLeft:"10%"}} onClick={this.goToTransform}>转账</Button>
                <p>账户地址： {account0}</p>
                <List >
                    {lists}
                </List>

            </div>

        )
    }
}
export default transationList