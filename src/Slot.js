import React, { Component } from 'react';
import './Slot.css';

class Slot extends Component {
    render() {
      return (
        <div className="slot"><div className={`${this.props.value} ${this.props.color}`}></div></div>
      );
    }
  }
  
  export default Slot;