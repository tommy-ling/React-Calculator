import React, { Component } from 'react'
import './Calculator.css'
const calcs = {
  ops: [{divide: '/'}, {multiply: 'x'}, {subtract: '-'}, {addition: '+'}],
  nums: [{seven: '7'}, {eight: '8'}, {nine: '9'}, {four: '4'}, {five: '5'},
        {six: '6'}, {one: '1'}, {two: '2'}, {three: '3'}, {zero: '0'}, {decimal: '.'}],
  clear: [{clear: 'AC'}],
  equal: [{equal: '='}],
  delete: [{delete: 'DEL'}]
}

class Calculator extends Component {
  constructor(props) {
    super(props)
    this.state = { display: '0', output: '' }
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick = (e) => {
    const display = this.state.display
    const output = this.state.output
    if(e.target.className === 'clear') {
      this.setState({display: '0', output: ''})
    } else if(e.target.textContent === 'DEL') {
      if(output.includes('=')) {
        this.setState({...this.state})
      } else {
        this.setState({display: display.slice(0, -1), output: output.slice(0,-1)})
      }
    } 
    
    else if(e.target.className === 'nums' && e.target.textContent !== '.') {
      if(display[0] === '0' && !display.includes('.')) {
        this.setState({display: '' + e.target.textContent, output: output.slice(0,-1) + e.target.textContent})
      } else if(display.includes('+')||display.includes('-')||display.includes('x')||display.includes('/')) {
        this.setState({display: '' + e.target.textContent, output: output + ('' + e.target.textContent)})
      } else {
        this.setState({display: display + e.target.textContent, output: output + e.target.textContent})
      }
    } else if(e.target.textContent === '.') {
      if(!display.includes('.') && !(display.includes('+')||display.includes('-')||display.includes('x')||display.includes('/'))) {
        this.setState({display: display + e.target.textContent, output: (output || '0') + e.target.textContent})
      } else if(display.includes('.')) {
        this.setState({display: display, output: output})
      } else if(display.includes('+')||display.includes('-')||display.includes('x')||display.includes('/')) {
        this.setState({display: '0' + e.target.textContent, output: output + '0' + e.target.textContent})
      }
    } 
    
    else if(e.target.className === 'ops' && !(display.includes('+') || display.includes('-') || display.includes('x') || display.includes('/'))) {
      if(e.target.textContent === 'x') {
        this.setState({output: output.includes('=') ? display + '??': output + '??', display: e.target.textContent})        
      } else {
        this.setState({output: output.includes('=') ? display + e.target.textContent: output + e.target.textContent, display: e.target.textContent})
      }
    } 
    
    else if(e.target.className === 'ops' && (display.includes('+') || display.includes('-') || display.includes('x') || display.includes('/'))) {
      if(e.target.textContent !== '-' && e.target.textContent !== 'x') {
        if(display.includes('-') && !display[1]) {
          this.setState({display: e.target.textContent, output: output.slice(0,-2) + e.target.textContent})
        } else if(display.includes('-') && display[1]) {
          this.setState({display: e.target.textContent, output: display + e.target.textContent})
        } else {
          this.setState({display: e.target.textContent, output: output.slice(0,-1) + e.target.textContent})
        }      
      } else if (e.target.textContent === 'x') {
        if(display.includes('-') && !display[1]) {
          this.setState({display: e.target.textContent, output: output.slice(0, -2) + '??'})
        } else if(display.includes('-') && display[1]) {
          this.setState({display: e.target.textContent, output: display + '??'})
        } else {
          this.setState({display: e.target.textContent, output: output.slice(0,-1) + '??'})
        }
      } else {
        if(display.includes('-') && !display[1]) {
          this.setState({...this.state})
        } else if(display.includes('-') && display[1]) {
          this.setState({display: e.target.textContent, output: display + e.target.textContent})
        } else {
          this.setState({display: "" + e.target.textContent, output: output + e.target.textContent})
        }
      }
    }

    else if(e.target.className === 'equal') {
      let numsToCalc = output.replace(/??/g, '*')
      function evalAlt(str) {
        return new Function('return ' + str)();
      }
      const result = evalAlt(numsToCalc).toString()

      function toNonFloat(result) {
        let nonFloat = result
        if(result.includes('000000')) {
          return nonFloat = result.slice(0, result.indexOf('000000'))
        } else if (result.includes('999999')) {
          nonFloat = result.slice(0, result.indexOf('999999'))
          let lastDit = parseInt(nonFloat[nonFloat.length -1]) + 1
          return nonFloat.slice(0, -1) + lastDit.toString()
        } else {
          return nonFloat
        }
      }
      const nonFloatResult = toNonFloat(result)
      this.setState({display: nonFloatResult, output: output + '='})
    }
  }
  
  renderElements = (key) => {   
    return calcs[key].map(el => (
    <div 
    onClick={this.handleClick}
    className={key}
    key={Object.values(el)[0]}
    style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gridArea: Object.keys(el)[0]}}>
      {Object.values(el)[0]}
    </div>
  ))}
  renderOps = this.renderElements('ops')
  renderNums = this.renderElements('nums')
  renderAC = this.renderElements('clear')
  renderEqual = this.renderElements('equal')
  renderDelete = this.renderElements('delete')

  render() {
    return (
      <div className='Calculator-frame'>
        <div className='Calculator-calcs'><span>{this.state.output}</span></div>
        <div className='Calculator-display'><span>{this.state.display}</span></div>
        <div className='Calculator-btns'>
          {this.renderAC}
          {this.renderOps}
          {this.renderNums}
          {this.renderEqual}
          {this.renderDelete}
        </div>
      </div>
    );
  }
}

export default Calculator;