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
      profileButton: 'Open Profile',
      showProfile: false,
      user_id: "",
      user_username: "",
      user_bio: "",
      user_wins: "",
    }

    this.firstCheck();
  }

  //clear input fields
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

  //sets loggin state and user info
  is_loggedin2(data) {
    this.setState({ 
      loggedIn: data.success, 
      user_username: data.username,
      user_bio: data.bio,
      user_wins: data.wins,
      user_id: data.id
    })
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
    .then (data => data.success ? this.is_loggedin2(data) : this.is_loggedin(data))
    .catch(error => console.error('Error:',error));
  }
  

  //function to adjust display based on login
  applyLogin(oldData){  
    const data2 = {'user_id': oldData.id};
    this.setState({
      user_username: oldData.username,
      user_bio: oldData.bio,
      user_wins: oldData.wins,
      user_id: oldData.id,
      showProfile: false,
      profileButton: 'Open Profile',
    })
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
              this.applyLogin(data);
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

  //detemrnies wether to show profile or not
  profile(){
    if(this.state.showProfile){
      this.setState({
        showProfile: false,
        profileButton: "Open Profile",
      })
    } else {
      this.setState({
        showProfile: true,
        profileButton: "Close Profile",
      })
    }
  }

  //changes the bio of user on click
  changeBio(){
    const data = {
      'bio': this.state.user_bio,
      'id': this.state.user_id
    };
    console.log(data);
    //send data to php file and wait for appropiate repsonse
    fetch("./changeBio.php", {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'content-type': 'application/json' }
    })

    .then(response => response.json())
    .then(data => alert(data.success ? `Bio Saved` : `Error: ${data.message}`))
    .catch(error => console.error('Error:',error));
  }


  render() {
    const currBio = this.state.user_bio;
    return (
      <div className="App">
        <div>
          {this.state.loggedIn &&
            <div id="profile">
              <button className='log' onClick={() => this.profile()}>{this.state.profileButton}</button>
              {this.state.showProfile &&
                <div id='profileInfo'>
                  <h3>{this.state.user_username}</h3>
                  <p>{currBio}</p>
                  <div className="bold">Wins: {this.state.user_wins} (from last login)</div>
                  <textarea value={this.state.user_bio} onChange={e => this.setState({ user_bio: e.target.value })}></textarea>
                  <button className='log' onClick={() => this.changeBio()}>Change Bio</button>
                </div>
              }
            </div>
          }
        </div>
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