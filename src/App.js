import React, { Component } from 'react';

import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import home from './home'
import mecnonic from './mecnonic'
import transationList from './transationList'
import transform from './transform'
import enter from './enter'
class App extends Component {
    constructor(props){
        super(props);
        this.state={

        }
    }

    render() {
        return (

                <Router>
                    <div>
                        <Route path='/' exact={true} component={enter}/>
                        <Route path='/home' component={home} />
                        <Route path='/mecnonic' component={mecnonic} />
                        <Route path='/transationList' component={transationList} />
                        <Route path='/transform' component={transform} />
                    </div>
                </Router>

        );
  }
}

export default App;
