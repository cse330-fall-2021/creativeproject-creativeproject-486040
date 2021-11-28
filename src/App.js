import React, { Component } from 'react';
import './App.css';
import Game from './Game.js';

class App extends Component {

  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      loggedIn: false,
    }

    this.firstCheck();
  }

  clearInputs() {
    this.setState({
      username: "",
      password: "",
    })
  }

  //sets loggin state
  is_loggedin(data) {
    this.setState({ loggedIn: data.success })
  }

  //checks for logged in or not
  firstCheck(){
    //send data to php file and wait for appropiate repsonse
    fetch("./logged_in.php", {
        method: 'POST',
        body: JSON.stringify(),
        headers: { 'content-type': 'application/json' }
    })
    .then(response => response.json())
    .then (data => this.is_loggedin(data))
    .catch(error => console.error('Error:',error));
  }
  

  //function to adjust display based on login
  applyLogin(user_id){  
    const data2 = {'user_id': user_id};
    //send data to php file and wait for appropiate repsonse
    fetch("./logged_in2.php", {
        method: 'POST',
        body: JSON.stringify(data2),
        headers: { 'content-type': 'application/json' }
    })
    .then(response => response.json())
    .then (data => this.is_loggedin(data))
    .catch(error => console.error('Error:',error));

    this.firstCheck();
  }

  //check if username exists before register
  findUser() {
    if(this.state.username && this.state.password) {
      // Make a URL-encoded string for passing POST data:
      const data = {
          'username': this.state.username,
      };
      //send data to php file and wait for appropiate repsonse
      fetch("./findUser.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
      })

      .then(response => response.json())
      .then(data => !data.id ? this.register() : this.taken())
      .catch(error => console.error('Error:',error));
    }
  }

  //alert for taken username
  taken() {
    alert(`Username taken`);
    this.clearInputs();
  }

  //register
  register() {
    const data = {
      'username': this.state.username,
      'password': this.state.password,
    };
    //send data to php file and wait for appropiate repsonse
    fetch("./register.php", {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'content-type': 'application/json' }
    })

    .then(response => response.json())
    .then(data => alert(data.success ? `You have been registered as ${data.user}` : `Error: ${data.message}`))
    .catch(error => console.error('Error:',error));

    this.clearInputs();
  }

  //login
  login() {
    const data = { 
      'username': this.state.username, 
      'password': this.state.password, 
    };

    //send data to php file and wait for appropiate repsonse
    fetch("./login.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
    .then(response => response.json())
    .then(data => {if (data.success === true) {
              this.applyLogin(data.id);
             alert("Logged in!");
         } else {
             alert("Incorrect Information");
             this.clearInputs();
         }})
    .catch(err => console.error(err));
  }

  //logout
  logout() {
    //send data to php file and wait for appropiate repsonse
    fetch("./logout.php", {
            method: 'POST',
            body: JSON.stringify(),
            headers: { 'content-type': 'application/json' }
    })
 
    .then(response => response.json())
    .then(data => this.is_loggedin(data))
    .catch(error => console.error('Error:',error));
 }

  render() {
    return (
      <div className="App">
        <div id="header">Connect 4</div>
        <div className="game">
          {this.state.loggedIn &&
            <div>
              <Game></Game>
              <div>
                <button className='log' onClick={() => this.logout()}>Log Out</button>
              </div>
            </div>
          } 
          {!this.state.loggedIn &&
            <div>
              <div>
                <input className="accountInput" type="text" name="username" id="username" placeholder="Username" value={this.state.username} onChange={e => this.setState({ username: e.target.value })}/>
              </div>
              <div>
                <input className="accountInput" type="password" name="password" id="password" placeholder="Password" value={this.state.password} onChange={e => this.setState({ password: e.target.value })}/>
              </div>
              <div>
                <button className='log' onClick={() => this.login()}>Log In</button>
                <button className='log' onClick={() => this.findUser()}>Register</button>
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default App;