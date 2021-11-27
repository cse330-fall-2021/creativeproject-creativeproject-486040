import React, { Component } from 'react';
import Slot from './Slot.js';
import './Col.css';

class Col extends Component {
    render() {
        let col = [];
        for(let i = 0; i < this.props.slots.length; i++) {
            col[i] = <Slot key={i} value={this.props.slots[i]}></Slot>
        }
        return (
            <div className='col' onClick={() => this.props.checkWin()}>
                {col}
            </div>
                
        );
    }
  }
  
  export default Col;