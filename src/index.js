import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
  }
  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
	constructor() {
	  super();
	  this.state = {
	    history: [{
	      squares: Array(9).fill(null),
	    }],
	    stepNumber: 0,
	    xIsNext: true
	  };
	}
  render() {
  	const history = this.state.history;
  	const current = history[this.state.stepNumber];
  	const winner = calculateWinner(current.squares);

  	const getMoveSquare = (currentMove) => {
  		if(history[currentMove-1] === undefined) return;
  		const previousBoard = history[currentMove-1].squares;
  		const currentBoard = history[currentMove].squares;
  		console.log("previousBoard: ", previousBoard)
  		console.log("currentBoard: ", currentBoard)
  		for(let i=0; i<9; i++) {
  			if(previousBoard[i] === null && currentBoard[i] !== null) {
  				let xCoord = i%3 + 1;
  				let yCoord;
  				switch(i) {
  					case 0: case 1: case 2:
  						yCoord = 3;
  						break;
  					case 3: case 4: case 5:
  						yCoord = 2;
  						break;
  					case 6: case 7: case 8:
  						yCoord = 1;
  						break;
  				}
  				return `${xCoord}, ${yCoord}`;
  			}
  		}
  	};
  	const moves = history.map((step, move) => {
  		const whosTurn = move % 2 ? 'X' : 'O';
      const desc = move ?
        `Move #${move} : ${whosTurn} moved to ${getMoveSquare(move)}`:
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
      	    onClick={(i) => {
      	    	this.handleClick(i);
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
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
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
