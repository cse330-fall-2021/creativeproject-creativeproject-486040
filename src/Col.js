import React, { Component } from 'react';
import Slot from './Slot.js';
import './Col.css';

class Col extends Component {
    render() {
        let col = [];
        for(let i = 0; i < this.props.slots.length; i++) {
            if(this.props.slots[i] === 'P1') { 
                col[i] = <Slot key={i} color={this.props.p1Color} value={this.props.slots[i]}></Slot>
            } else if(this.props.slots[i] === 'P2') { 
                col[i] = <Slot key={i} color={this.props.p2Color} value={this.props.slots[i]}></Slot>
            } else{ 
                col[i] = <Slot key={i} color="" value={this.props.slots[i]}></Slot>
            }
        }
        return (
            <div className='col' onClick={() => this.props.checkWin()}>
                {col}
            </div>
                
        );
    }
  }
  
  export default Col;