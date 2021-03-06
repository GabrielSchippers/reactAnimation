import React, { Component } from 'react';
import update from 'react-addons-update';
import logo from './logo.svg';
import './App.css';

const maxVelocity = 1
const bubbleCount = 7

const circleData = {
  "price": [15, 30, 45, 60, 75],
  "name": ["Shorts", "Shoe", "Cap", "Tennis", "Pants"]
}
class App extends Component {

  constructor (props) {
    super(props)

    this.state = {
      circleStyleArr: [],
      queueArr:[],
      keyPos: 0,
      timeOfLastUpdate: -1
    }

    this.tick = this.tick.bind(this);
    this.checkQueue = this.checkQueue.bind(this)
  }
  componentDidMount () {
    this.movementTimer = setInterval(this.tick, 33);
    this.queueTimer = setInterval(this.checkQueue, 3000);
  }

  componentWillUnmount () {
    clearInterval(this.movementTimer)
    clearInterval(this.queueTimer)
  }


  checkBoundaryCollision(newLeft, newTop, circle) {
    let resolvedParameters = {
      left: newLeft,
      top: newTop,
      movementVector: circle.movementVector
    }

    //check left/right boundaries
    if ((newLeft <= 0) || (newLeft + circle.width > 1920)) {
      resolvedParameters.movementVector.x *= -1
    }

    //check top/bottom boundaries
    if ((newTop < -30) || (newTop + circle.height > 805)) {
      resolvedParameters.movementVector.y *= -1 
    }

    return resolvedParameters
  }

  // TODO: Resolve individual collisions
  // This will consider the X anf Y components of each vector (movementVector * velocity) individually
  handleParticleCollision(focusCircle, subjectCircle, focusMovementValues, focusPosition) {
    switch(focusPosition) {
      case 'top left':
        if (focusMovementValues.movementVector.y >= 0) {

        } else {

        }
        break;
      case 'top right':

        break;
      case 'bottom left':

        break;
      case 'bottom right':

        break;
      default:
        return focusMovementValues
    }
  }

  checkParticleCollision(movementValues, circles) {
    let adjustedMovementValues = movementValues

    function checkVerticalParticalAlignment (focusCircle, subjectCircle, focusMovementValues, focusPosition) {
      let newFocusMovementValues = focusMovementValues

      if (focusMovementValues.top < subjectCircle.top) {
        if ((focusMovementValues.top + focusCircle.height) > subjectCircle.top) {
          let collisionPosition = 'top ' + focusPosition
          newFocusMovementValues = this.handleParticleCollision(focusCircle, subjectCircle, focusMovementValues, collisionPosition)      
        }
      } else {
        if ((subjectCircle.top + subjectCircle.height) > focusMovementValues.top) {
          let collisionPosition = 'bottom' + focusPosition
          newFocusMovementValues = this.handleParticleCollision(focusCircle, subjectCircle, focusMovementValues, collisionPosition) 
        }
      }

      return newFocusMovementValues
    }
    
    for (let i = 0; i < circles.length; i++) {
      for (let j = 0; j < circles.length; j++) {
        if (i !== j) {
          //check collision
          let focusCircle = circles[i]
          let subjectCircle = circles[j]

          if (movementValues.left < subjectCircle.left) {
            if ((movementValues.left + focusCircle.width) > subjectCircle.left) {
              //check vertical
              adjustedMovementValues = checkVerticalParticalAlignment(focusCircle, subjectCircle, movementValues, 'left')
            }
          } else {
            if ((subjectCircle.left + subjectCircle.width) > movementValues.left) {
              //check vertical
              adjustedMovementValues = checkVerticalParticalAlignment(focusCircle, subjectCircle, movementValues, 'right')
            }
          }
        }
        return adjustedMovementValues
      }
    }
  }

  tick () {
    let newCircleStyleArr = this.state.circleStyleArr

    for (let i = 0; i < newCircleStyleArr.length; i++) {
      let circle = newCircleStyleArr[i] || {}
      let newLeft = circle.left + (circle.velocity * circle.movementVector.x)
      let newTop = circle.top + (circle.velocity * circle.movementVector.y)
      let adjustedMovementValues = this.checkBoundaryCollision(newLeft, newTop, circle)

      circle.left = adjustedMovementValues.left
      circle.top = adjustedMovementValues.top
      circle.movementVector = adjustedMovementValues.movementVector
    }

    if (this.state.timeOfLastUpdate === -1) {
      this.setState({
        circleStyleArr: newCircleStyleArr,
        timeOfLastUpdate: new Date() - this.state.timeOfLastUpdate
      })
    } else {
      this.setState({
        timeOfLastUpdate: new Date()
      })
    }
  }
  checkQueue = () => {
    var time = new Date();
    var newCircleStyleArr =[];
    if (this.state.queueArr.length) {
      var diff = time - this.state.circleStyleArr[0].emerTime;
      console.log("diff:", diff);

      if(diff > 20000){
        this.state.circleStyleArr.shift()
        newCircleStyleArr = this.state.circleStyleArr.concat(this.state.queueArr[0]);
        this.state.queueArr.shift();
        this.setState({ 
          circleStyleArr: newCircleStyleArr,
          keyPos: this.state.keyPos+1
        });
      }
    }
    
  }
  addCircle = () => {
    var tempArr = [];
    var queueArr = [];
    let isStart = false;

    tempArr = [...this.state.circleStyleArr];
    if (tempArr.length < bubbleCount){
      var i = 0;
      tempArr.push(this.genStyle(tempArr));

      this.setState({
        circleStyleArr: tempArr,
        keyPos: this.state.keyPos+i,
        queueArr: queueArr,
      });
    }
    else {
      i = 1;
      queueArr = [...this.state.queueArr]
      queueArr.push(this.genStyle(tempArr));
      console.log("Queued Arr:", queueArr);
      this.setState({
        queueArr: queueArr,
      });

    }     
    
    setTimeout(() => {
      if (!isStart) {
        this.setState(update(this.state, { circleStyleArr: { [tempArr.length - 1]: { $merge: {
          left: this.getRandomX(),
          top: this.getRandomY(),
          transition: 'left 1s, top 1s',
        }} } }));
      }
    }, 4000);
  }

  getRandomColor = () => {
    return '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
  }

  getRandomX = () => Math.floor(Math.random() * (window.innerWidth-250))

  getRandomY = () => Math.floor(Math.random() * (window.innerHeight-460))

  getRandomVectorComponent() {
    let magnitude = Math.random()
    let sign = Math.random() > 0.5 ? 1 : -1

    magnitude *=  sign

    return magnitude
  }

  genStyle = (circleArr) => {
    var left, top, circleSize, circleColor, fontSize, movementX, movementY, velocity, currentTime;

    do {
      left = this.getRandomX();
      top = this.getRandomY();
      circleSize = Math.floor(Math.random()*120+100);
      circleColor = this.getRandomColor();
      fontSize = circleSize * 0.6;
      movementX = this.getRandomVectorComponent();
      movementY = 1 - movementX;
      velocity = Math.random() * maxVelocity;
      currentTime = new Date();

    }
    while (this.isNotAvailable(circleArr, left, top, circleSize))

    return {
      'left': window.innerWidth / 2 - circleSize / 2,
      'top': 0,
      'width': circleSize,
      'height': circleSize,
      'backgroundColor': circleColor,
      'fontSize': fontSize,
      'moving': false,
      'velocity': velocity,
      'movementVector': {x:movementX,y:movementY},
      'emerTime': currentTime
    };
  }

  // set the random unoverlapping position
  isNotAvailable = (posArr, newLeft, newTop, newSize) => {
    for (var i = 0; i < posArr.length; i ++) {
      const regLeft = posArr[i].left,
            regTop = posArr[i].top,
            regSize = posArr[i].width;
      if ((regLeft - newSize < newLeft && newLeft < regLeft + regSize) && (regTop-newSize < newTop && newTop < regTop+regSize)) {
        return true;
      }
    }

    return false;
  }

  render() {
    
    return (
      <div className="App">

        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>

        <div className="circle-Control">
          <input onClick={this.addCircle} type="button" value="Add"/>
        </div>

        { 
          this.state.circleStyleArr.map((item, idx) => {
            return (
              <div
                  className={(this.state.keyPos !== null) ? 'Add-Splash' : 'Circle-Shrink'}
                  key={`circle-item-${idx+this.state.keyPos}`}>
                <div
                  className='Circle'
                  style={item} >
                  <div className='Circle-Price'>{circleData.price[(idx+this.state.keyPos)%5]}</div> 
                  <div className='Circle-Detail'>{circleData.name[(idx+this.state.keyPos)%5]}</div>
                </div>
              </div>
            )  
          })
        }

      </div>
    );
  }
}

export default App;
