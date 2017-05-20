import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

let boardSize = Number(prompt("What should the width/height of the board be?"));
let winningSquares;

function Square(props) {
  return (
    <button className={"square " + props.isWinningSquare} onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  generateBoard(size) {
  	let board = new Array(size).fill(new Array(size).fill(null))
  	.map((row, rowIndex) => {
  		let squares = row.map((square, squareIndex) => {
  			let xCoord = squareIndex;
  			let yCoord = Math.abs(rowIndex+1-size);
  			let coords = `${squareIndex},${Math.abs(rowIndex+1-size)}`
  			return (
  				<Square
						key={rowIndex*size + squareIndex}
						coords={coords}
						isWinningSquare={isWinningSquare(xCoord, yCoord) ? 'winning-square' : ''}
						value={this.props.squares[yCoord][xCoord]}
						onClick={() => this.props.onClick(coords)}
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
	      squares: Array(boardSize).fill(Array(boardSize).fill(null))
	    }],
	    stepNumber: 0,
	    xIsNext: true
	  };
	}
  render() {
  	const history = this.state.history;
  	const current = history[this.state.stepNumber];
  	const winner = calculateWinner(current.squares);
  	let whosTurn;

  	const moves = history.map((step, move) => {
  		whosTurn = move % 2 ? 'X' : 'O';
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
  	  status = 'Winner: ' + whosTurn;
  	} else {
  	  status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
  	}
    return (
      <div className="game">
        <div className="game-board">
          <Board
          	squares={current.squares}
      	    onClick={(coords) => {
      	    	this.handleClick(coords);
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
  handleClick(coords) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    const xCoord = coords.split(',')[0]
    const yCoord = coords.split(',')[1]

    if (calculateWinner(squares) || squares[yCoord][xCoord]) {
      return;
    }
    // WHY DOES THE ROW NEED TO BE MODIFIED IN THIS WAY?
    let rowToModify = squares[yCoord].slice();
    rowToModify[xCoord] = this.state.xIsNext ? 'X' : 'O';
    squares[yCoord] = rowToModify;

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

function isValidCoord(x, y){
	return !(x >= boardSize || x < 0 || y >= boardSize || y < 0)
}

function isWinningSquare(x,y) {
	if(winningSquares) {
		for(let i=0; i<3; i++) {
			if(winningSquares[i].x === x && winningSquares[i].y === y) return true;
		}
		return false;
	}
}

function calculateWinner(squares) {
	//Figure out winner for individual square
	// 1. Is the square value not null
	// 2. Do any adjacent squares have the same value?
	// 3. If yes, does the next square in that line have the same value?

	for(let y=0; y<squares.length; y++) {
		for(let x=0; x<squares.length; x++) {
			if(squares[y][x] !== null) {
				let playerMarker = squares[y][x];
				for(let xx=-1; xx<=1; xx++) {
					for(let yy=-1; yy<=1; yy++) {
						if(!isValidCoord((y+yy),(x+xx)) || (xx === 0 && yy === 0) || (x === xx && y === yy)) {
						} else {
							if(squares[y+yy][x+xx] === playerMarker) {
								if(isValidCoord((y+yy+yy),(x+xx+xx))) {
									if(squares[y+yy+yy][x+xx+xx] === playerMarker) {
										winningSquares = [{
											x: x,
											y: y
										},{
											x: x+xx,
											y: y+yy
										},{
											x: x+xx+xx,
											y: y+yy+yy
										}]
										return true;
									}
								}
							}
						};
					}
				}
			}
		}
	}
}

