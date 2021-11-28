import React, { Component } from 'react';
import './Game.css';
import Col from './Col.js'
  
class Game extends Component {

    constructor() {
      super();
      this.state = {
        mode: '',
        start: false,
        board: new Array(7).fill(null).map(x => Array(6).fill(null)),
        turn: 'P1',
        winner: '',
        draw: false,
        p1Color: 'Red',
        p2Color: 'Blue',
      }
    }
  
    //reset the game for a new round
    startGame(newMode){
      this.setState({
         board: new Array(7).fill(null).map(x => Array(6).fill(null)),
         mode: newMode,
         start: true, 
         draw: false,
         turn: 'P1',
      })
    }
    
    //when a play is made on the board
    play(col){
      let board = this.state.board.map(function(col) {
        return col.slice();
      });
      //check to see if the column is full and if not, add the play
      if(board[col].indexOf(null) !== -1 ) {
        let newCol = board[col].reverse();
        newCol[newCol.indexOf(null)] = this.state.turn;
        newCol.reverse();
        //switch turns
        this.setState({
          turn: (this.state.turn === 'P1') ? 'P2' : 'P1',
          board: board,
        })
        //check for draw after a move is made
        if(this.checkDraw(this.state.board)) {
            this.setState({
                draw: true
            })
          }
       }
    }
  
    //check if game's over before making a play
    checkWin(col) {
      if(this.state.winner === '' && !this.state.draw) {
        this.play(col);
      }
    }

    //check for draw
    checkDraw(board) {
        let count = 0;
        for (let c = 0; c < 7; c++) {
            for (let r = 0; r < 6; r++) {
                if(board[c][r] !== null) {
                    count++;
                }
            }
        }
        return count > 40; 
    }
    
    //after update render
    componentDidUpdate(){
      //check for winner
      let winner = this.isWin(this.state.board);
      if(this.state.winner !== winner){
        this.setState({
            winner: winner
        });
        if(winner === "P1 won"){
          this.addWin();
        }
      //if playing against ai, make ai move
      } else {
         if(this.state.mode === 'pvai' && this.state.turn === 'P2') {
            let col = this.getSpot();
            this.checkWin(col);
         }
      }
    }

    //adds a win to the user's win count
    addWin(){
      fetch("./addWin.php", {
        method: 'POST',
        body: JSON.stringify(),
        headers: { 'content-type': 'application/json' }
      })
      .then(response => response.json())
      .then (data => data.success && alert("Win Recorded"))
      .catch(error => console.error('Error:',error));
    }

    //get an empty spot on the board for the ai to play
    getSpot() {
        let col = Math.floor((Math.random() * 7));
        if(this.state.board[col].indexOf(null) !== -1){
            return col;
        } else {
            return this.getSpot();
        }
    }

    //check given slots for 4-in-a-row
    isWinHelper(s1, s2 , s3, s4) {
        return ((s1 !== null) && (s1 === s2) && (s1 === s3) && (s3 === s4));
    }
    
    //check all possible 4-in-a-row's on the board
    isWin(board) {
        //check verticles
        for (let c = 0; c < 7; c++) {
            for (let r = 0; r < 4; r++) {
                if (this.isWinHelper(board[c][r], board[c][r+1], board[c][r+2], board[c][r+3])) {
                    return board[c][r] + ' won';
                }
            }
        }
        //checks horizontal
        for (let r = 0; r < 6; r++) {
             for (let c = 0; c < 4; c++) {
                 if (this.isWinHelper(board[c][r], board[c+1][r], board[c+2][r], board[c+3][r])) {
                     return board[c][r] + ' won';
                 }
            }
        }
        //checks positive diagonal
        for (let r = 0; r < 3; r++) {
             for (let c = 0; c < 4; c++) {
                 if (this.isWinHelper(board[c][r], board[c+1][r+1], board[c+2][r+2], board[c+3][r+3])) {
                     return board[c][r] + ' won';
                 }
            }
        }
        //checks negative diagonal
        for (let r = 0; r < 4; r++) {
             for (let c = 3; c < 6; c++) {
                 if (this.isWinHelper(board[c][r], board[c-1][r+1], board[c-2][r+2], board[c-3][r+3])) {
                     return board[c][r] + ' won';
                 }
            }
        }
        return "";
    }

    render(){
  
      //on game over display result
      let result = "";
      if(this.state.winner !== "" || this.state.draw){
        result = "result show";
      } else {
        result = "result";
      }
  
      //instantiate columns of board so may be clicked on
      let cols = [];
      for(let i = 0; i < this.state.board.length; i++) {
          cols[i] = <Col key={i} p1Color={this.state.p1Color} p2Color={this.state.p2Color} slots={this.state.board[i]} checkWin={() => this.checkWin(i)}></Col>
      }
  
      return (
            <div>
                {this.state.start &&
                    <div className="board">
                    {cols}
                    </div>
                }
                <div className={result}>{this.state.winner}</div>
                {this.state.draw &&
                    <div className={result}>Draw</div>
                }
                {(!this.state.start || this.state.winner !== '' || this.state.draw) &&
                    <div>
                        <div>
                            <button className='startButton' onClick={() => this.startGame('pvp')}>P vs P</button>
                            <button className='startButton' onClick={() => this.startGame('pvai')}>P vs AI</button>
                        </div>
                        <div>
                          <label className="color">P1 Color: </label>
                          <select name="p1Color" id="p1Color" value={this.state.p1Color} onChange={e => this.setState({ p1Color: e.target.value })}>
                            <option value="Red">Red</option>
                            <option value="Orange">Orange</option>
                            <option value="Yellow">Yellow</option>
                          </select> 
                          <label className="color">P2 Color: </label>
                          <select name="p2Color" id="p2Color" value={this.state.p2Color} onChange={e => this.setState({ p2Color: e.target.value })}>
                            <option value="Blue">Blue</option>
                            <option value="Green">Green</option>
                            <option value="Purple">Purple</option>
                          </select> 
                        </div>
                    </div>
                }
            </div>
      )
    }
  }

  export default Game;