import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// let boardSize = Number(prompt("What should the width/height of the board be?"));
let boardSize = 5

function Square(props) {
  return (
    <button className="square" onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  generateBoard(size) {
  	let board = new Array(size).fill(new Array(size).fill(null))
  	.map((row, rowIndex) => {
  		let squares = row.map((square, squareIndex) => {
  			let squareNum = rowIndex*size + squareIndex;
  			let coords = `${squareIndex+1},${Math.abs(rowIndex-size)}`
  			return (
  				<Square
						key={squareNum}
						coords={coords}
						value={this.props.squares[squareNum]}
						onClick={() => this.props.onClick(squareNum, coords)}
					/>
				)
  		})
			return <div key={rowIndex} className="board-row">{ squares }</div>
  	})
  	return board;
  }
  render() {
    return (
      <div>
      	{ this.generateBoard(boardSize) }
      </div>
    );
  }
}

class Game extends React.Component {
	constructor() {
	  super();
	  this.state = {
	    history: [{
	      squares: Array(Math.pow(boardSize, 2)).fill(null),
	    }],
	    stepNumber: 0,
	    xIsNext: true
	  };
	}
  render() {
  	const history = this.state.history;
  	const current = history[this.state.stepNumber];
  	const winner = calculateWinner(current.squares);
  	debugger
  	const moves = history.map((step, move) => {
  		const whosTurn = move % 2 ? 'X' : 'O';
      const desc = move ?
        `Move #${move} : ${whosTurn} moved to ${history[move].moveCoords}`:
        'Game start';
      return (
        <li key={move}>
          <a
          	href="#"
          	className={this.state.stepNumber === move ? 'current-move' : ''}
          	onClick={() => this.jumpTo(move)}
          >
          	{desc}
          </a>
        </li>
      );
    });

  	let status;
  	if (winner) {
  	  status = 'Winner: ' + winner;
  	} else {
  	  status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
  	}
    return (
      <div className="game">
        <div className="game-board">
          <Board
          	squares={current.squares}
      	    onClick={(i, coords) => {
      	    	this.handleClick(i, coords);
      	    }}
          />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true,
    });
  }
  handleClick(i, coords) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
	      moveCoords: coords,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
	// debugger
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
