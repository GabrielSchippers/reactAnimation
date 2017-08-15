import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import {pulse} from 'react-animations'
import Radium from 'radium';

const styles = {
 pulse: {
   animation: 'x 1s infinite',
   animationName: Radium.keyframes(pulse, 'pulse')
 }
}
console.log("Pulse", styles);


const circleData = {
  "price": [15, 30, 45, 60, 75],
  "name": ["Shorts", "Shoe", "Cap", "Tennis", "Pants"]
}
class App extends Component {
  state = {
    circleStyleArr: [],
    keyPos: 0,
  }

  addCircle = () => {
    var tempArr = [];

    if (this.state.keyPos > 0) {
      tempArr = this.state.circleStyleArr;

      tempArr.shift();    
      tempArr.push(this.genStyle(tempArr));
    }
    else {     
      for ( var i = 0; i < parseInt(this.refs['count'].value); i++ ) {
        tempArr.push(this.genStyle(tempArr))
      }
    }
    
    this.setState({
      circleStyleArr: tempArr,
      keyPos: this.state.keyPos+1,
    });
  }

  getRandomColor = () => {
    return '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
  }

  genStyle = (circleArr) => {
    var left, top, circleSize, circleColor;

    do {
      left = Math.floor(Math.random() * (window.innerWidth-250));
      top = Math.floor(Math.random() * (window.innerHeight-460));
      circleSize = Math.floor(Math.random()*180+70);
      circleColor = this.getRandomColor();
      // console.log("55555", left);
    }
    while (this.isNotAvailable(circleArr, left, top, circleSize))

    return {
      'left': left,
      'top': top,
      'width': circleSize,
      'height': circleSize,
      'backgroundColor': circleColor,
    };
  }

  isNotAvailable = (posArr, newLeft, newTop, newSize) => {
    console.log("6666", posArr);
    for (var i = 0; i < posArr.length; i ++) {
      const regLeft = posArr[i].left,
            regTop = posArr[i].top,
            regSize = posArr[i].width;
      // console.log("22222", regLeft);
      // console.log("new left", newLeft);
      if ((regLeft - newSize < newLeft && newLeft < regLeft + regSize) && (regTop-newSize < newTop && newTop < regTop+regSize)) {
        // console.log("33333");
        return true;
      }
    }

    return false;
  }

  render() {
    console.log("111",this.state.circleStyleArr);
    
    return (
      <div className="App">

        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>

        <div className="circle-Control">
          <select defaultValue={4} onChange={this.selectChange} ref='count' className="Circle-count">
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
          </select>  
          <input onClick={this.addCircle} type="button" value={this.state.keyPos>0?"Add":"Start"} />
        </div>

        { 
          this.state.circleStyleArr.map((item, idx) => {
            {/* var idx = Math.floor(Math.random() * 5); */}
            return (
              <CSSTransitionGroup 
                  key={`circle-item-${idx+this.state.keyPos}`}
                  transitionName="anim" 
                  transitionAppear={true} 
                  transitionAppearTimeout={3000}
                  transitionEnter={true}
                  transitionEnterTimeout={3000} 
                  transitionLeave={false} >
                <div
                    className='Circle'
                    style={item} >
                  <span className='Circle-Price'>{circleData.price[(idx+this.state.keyPos)%5]}</span> 
                  <br/> 
                  <span className='Circle-Detail'>{circleData.name[(idx+this.state.keyPos)%5]}</span>
                </div>
              </CSSTransitionGroup>   
            )  
          })
        }

      </div>
    );
  }
}

export default App;
