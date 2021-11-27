import React, { Component } from 'react';
import './App.css';
import Game from './Game.js';

class App extends Component {

  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      loggedIn: true,
    }
  }

  //sets loggin state
  is_loggedin(data) {
    this.setState({ loggedIn: data.success })
  }

  //checks for logged in or not
  firstCheck(){
    fetch("http://10.0.2.2/src/logged_in.php", {
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

    fetch("http://10.0.2.2/src/logged_in2.php", {
        method: 'POST',
        body: JSON.stringify(data2),
        headers: { 'content-type': 'application/json' }
    })
    .then(response => response.json())
    .then (data => this.is_loggedin(data))
    .catch(error => console.error('Error:',error));

    this.firstCheck();
  }

  //register
  register() {
    // Make a URL-encoded string for passing POST data:
    const data = {
        'username': this.state.username,
        'password': this.state.password,
    };

    fetch("http://10.0.2.2/src/register.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })

        .then(response => response.json())
        .then(data => alert(data.success ? `You have been registered as ${data.user}` : `Error: ${data.message}`))
        .catch(error => console.error('Error:',error));
  }

  //login
  login() {
    const data = { 
      'username': this.state.username, 
      'password': this.state.password, 
    };

    fetch("http://10.0.2.2/src/login.php'", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
    .then(response => response.json())
    .then(data => {if (data.success === true) {
              this.applyLogin(data.id);
             alert("You have logged in");
         } else {
             alert("You have not logged in");
         }})
    .catch(err => console.error(err));
  }

  //logout
  logout() {
    //send data to php file and wait for appropiate repsonse
    fetch("http://10.0.2.2/src/logout.php", {
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
                <input className="accountInput" type="text" name="username" id="username" placeholder="Username" onChange={e => this.setState({ username: e.target.value })}/>
              </div>
              <div>
                <input className="accountInput" type="password" name="password" id="password" placeholder="Password" onChange={e => this.setState({ password: e.target.value })}/>
              </div>
              <div>
                <button className='log' onClick={() => this.login()}>Log In</button>
                <button className='log' onClick={() => this.register()}>Register</button>
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default App;