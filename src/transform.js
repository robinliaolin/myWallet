import React,{Component} from 'react'
import {Form,Input,Dimmer,Loader,Image,Segment} from 'semantic-ui-react'
import HDWalletProvider from "truffle-hdwallet-provider";
import Web3 from 'web3'
const infuraKey = "https://rinkeby.infura.io/v3/0a12e56321594355b0c928b3a19c11cb";
class transform extends Component{
    constructor(props){
        super(props);
        this.state={
            ownerAddress:null,
            web3:{},
            to:"",
            transformNum:0,
            mecnonic:"",
            balance:"",
            isLoading:false
        }
    }
    componentDidMount(){
        let mecnonic = localStorage.getItem("mecnonic");
        this.setState({
            mecnonic
        })
        this.initalizeWeb3(mecnonic)
    }
    initalizeWeb3 = async (mecnonic)=>{
        try{
            const provider = new HDWalletProvider(mecnonic,infuraKey)
            let web3 = new Web3(provider);
            let accounts = await web3.eth.getAccounts();
            console.log("目前外部账号是"+accounts[0]);
            let balance = await web3.eth.getBalance(accounts[0]);
                this.setState({
                web3,
                ownerAddress:accounts[0],
                balance,
            })
        }catch(e){
            alert("助记词错误！")
        }
    };

    transfromValue = async ()=>{
        const {ownerAddress,web3,to,transformNum} = this.state
        this.setState({
            isLoading:true
        })
        try{
            let receipt = await web3.eth.sendTransaction({
                from:ownerAddress,
                to:to,
                value:transformNum,
                gas:"3000000"
            })
            console.log("转账交易的hash："+receipt.transactionHash);
            this.setState({
                isLoading:false
            })
            window.location.reload(true);
            alert("转账成功！")
        }catch(e){
            this.setState({
                isLoading:false
            })
            alert("转账失败！")
        }
    }
    transformation = ()=>{
        const {web3,ownerAddress,to,transformNum} = this.state;
        try {
            this.transfromValue(web3,ownerAddress,to,transformNum);
        }catch (e){
            alert("转账失败！")
        }


    }
    handleToAddressChange=(e)=>{
        this.setState({
            to:e.target.value
        })
    }
    handleValueChange=(e)=>{
        this.setState({
            transformNum:e.target.value
        })
    }
    render(){
        const {ownerAddress,balance,isLoading} = this.state;
        return (
            <Segment>
                <Dimmer active={isLoading}inverted>
                    <Loader size='large'>Loading</Loader>
                </Dimmer>

                {/*<Image src='/images/wireframe/paragraph.png' />*/}
                <Form onSubmit={this.transformation}>
                    <Form.Field required>
                        <Form.Input fluid label='您的账户地址' placeholder={ownerAddress} readOnly />
                    </Form.Field>
                    <Form.Field >
                        <label>余额: {balance} wei</label>
                    </Form.Field>
                    <Form.Field required>
                        <label>对方账户地址</label>
                        <Input placeholder='请输入对方账户地址' onChange={this.handleToAddressChange}/>
                    </Form.Field>
                    <Form.Field required>
                        <label>转账金额</label>
                        <Input
                            label={{ basic: true, content: 'wei' }}
                            labelPosition='right'
                            placeholder='请输入转账金额'
                            onChange={this.handleValueChange}
                        />

                    </Form.Field>
                    <Form.Button style={{width:"80%",marginLeft:"10%"}}>转账</Form.Button>
                </Form>
            </Segment>

        )
    }
}
export default transform
