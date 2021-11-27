import React, { Component } from 'react';
import './Slot.css';

class Slot extends Component {
    render() {
      return (
        <div className="slot"><div className={this.props.value}></div></div>
      );
    }
  }
  
  export default Slot;