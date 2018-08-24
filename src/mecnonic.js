import React,{Component} from 'react';
import {Form,TextArea} from 'semantic-ui-react'
import crypto from 'crypto'

class mecnonic extends Component{
    constructor(props){
        super(props);
        this.state={
            mecnonic:"",
            showSecretItem:false,
            secret:""
        }
    }
    componentDidMount(){
        let mnemonic = localStorage.getItem("mnemonic");
        if(mnemonic !== ""){
            this.setState({
                mecnonic:mnemonic
            })
        }
    }
    cryptoHash = (data)=>{
        const secretHash = crypto.createHash('sha256');
        secretHash.update(data);
        let hash = secretHash.digest('hex');
        return hash;
    }
    secretVerify =(data)=>{
        let hash = this.cryptoHash(data);
        let localHash = localStorage.getItem("secret");
        if(localHash!== undefined){
            return hash===localHash;
        }
        else
            return false;
    }
    nextStep = ()=>{
        this.setState({
            showSecretItem:true
        })
    }
    clearMnemonic = ()=>{
        let isRight = this.secretVerify(this.state.secret);
        if(!isRight){
            alert("密码不对,请重新输入！");
            return ;
        }
        localStorage.removeItem("mnemonic");
        window.location.href="http://localhost:3000/transationList"
    }
    handleMecnonicChange = (e)=>{
        this.setState({
            mecnonic:e.target.value
        })
    }
    handleSecretChange = (e)=>{
        this.setState({
            secret:e.target.value
        })
    }
    render(){
        const {mecnonic,showSecretItem,secret} = this.state;
        return (
            <div>
                <Form onSubmit={this.nextStep}>
                    {/*<Form.Input fluid label='助记词' value={mecnonic} onChange={this.handleMecnonicChange} />*/}
                    <Form.Field control={TextArea} label='助记词' value={mecnonic} />
                    <Form.Input fluid label='提醒：' value={'请不要在电脑上存储助记词，最好用笔记本记录下来，存到个人保险柜里'} style={{border:"none"}} readOnly/>
                    <Form.Button >备份钱包</Form.Button>
                </Form>
                {
                    showSecretItem && (
                        <Form onSubmit={this.clearMnemonic}>
                            <Form.Input fluid label='密码' placeholder="请输入密码" onChange={this.handleSecretChange} />
                            <Form.Input fluid label='提醒：' value={'已确认密码，并清除助记词，请妥善保存助记词！'} style={{border:"none"}} readOnly/>
                            <Form.Button >清除助记词</Form.Button>
                        </Form>
                    )
                }
            </div>

        )
    }
}
export default mecnonic