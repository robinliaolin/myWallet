import React,{Component} from 'react';
import {Button} from 'semantic-ui-react'
class enter extends Component{
    render(){
        return (
            <div>
                <h3 style={{width:"100%"}}>钱包</h3>
                <Button style={{width:"80%",marginLeft:"10%"}} onClick={
                    ()=>{
                        window.location.href="http://localhost:3000/home"
                    }
                }>创建钱包</Button><br/>
                <p></p>
                <Button style={{width:"80%",marginLeft:"10%"}} onClick={()=>{
                    window.location.href="http://localhost:3000/mecnonic"
                }}>导入钱包</Button>

            </div>
        )
    }
}
export default enter