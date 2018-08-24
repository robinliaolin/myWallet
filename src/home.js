import React, { Component } from 'react';
import { Form,Button,Checkbox,Segment} from 'semantic-ui-react';
import crypto from 'crypto';
import bip39 from 'bip39'
import Web3 from 'web3'
import HDWalletProvider from 'truffle-hdwallet-provider'

const infuraKeyId = "https://rinkeby.infura.io/v3/0a12e56321594355b0c928b3a19c11cb";
let createHmax = require('create-hmac');
class home extends Component {
    constructor(props){
        super(props);
        this.state={
            secret:"",

        }
    }
    componentDidMount(){
        this.setState({
            secret:localStorage.getItem("secret")
        })
    }
    sercretVerify = (data)=>{
        console.log(data)
        if(data===null){
            return false;
        }
        if(data.length<8){
            return false;
        }
        let str = /[0-9]{6,}[a-zA-Z]{2,}/;
        return str.test(data);
    };
    mnemonicVerify =(data)=>{
        let hash = this.cryptoSha256HMac(data);
        return hash === localStorage.getItem("mnemonic");
    }
    generateMecnonic = ()=>{
        let mnemonic = bip39.generateMnemonic();
        console.log("助记词："+mnemonic);
        return mnemonic;
    }
    handleSecretChange = (e)=>{
        this.setState({
            secret:e.target.value
        })
    }
    cryptoHash256 = (data)=>{
        let hash = crypto.createHash("sha256");
        hash.update(data);
        return hash.digest('hex');
    }
    cryptoSha256HMac = (data)=>{
        let sha = "sha224";
        let key = this.state.secret;
        if(key === null){
            key = "123456ll"
        }
        let hash = createHmax(sha,key);
        hash.update(data);
        return hash.digest('hex');
    }
    initialWeb3 = (mecnonic)=>{
        let provider = new HDWalletProvider(mecnonic,infuraKeyId);
        let web3 = new Web3(provider);
        return web3;
    }
    nextStep = ()=>{
        const {secret} = this.state;
        if(secret===""){
            alert("密码不能为空！")
            return
        }
        let isRight = this.sercretVerify(secret);
        if(!isRight){
            alert('密码格式不正确');
        }
        else {
            let hash = this.cryptoHash256(secret);
            let mnemonic = this.generateMecnonic();
            let mnemonicHash = this.cryptoSha256HMac(mnemonic);

            localStorage.setItem("mnemonic",mnemonic);
            localStorage.setItem("secret",hash);
            window.location.href="http://localhost:3000/mecnonic";
        }
    }
    render() {
        const {secret,} = this.state;
        return (
            <Segment >
                <Form onSubmit={this.nextStep}>
                    <Form.Group widths='equal' >
                        <Form.Input fluid label='secret' placeholder='secret' onChange={this.handleSecretChange}/>
                    </Form.Group>
                    <Form.Checkbox label='I agree to the Terms and Conditions' />
                    <Button type='submit'>生成助记词</Button>
                </Form>
            </Segment>
        );
    }
}

export default home;
