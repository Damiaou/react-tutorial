import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import './index.css';

function Square(props) {
  return (
    <button
      className={props.className}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  inWinnerLine(i)  {
    return this.props.winningLine ? this.props.winningLine.includes(i) : false;
  }

  renderSquare(i) {
    const won = this.inWinnerLine(i) ? 'won' : 'no-luck';
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        className={`square ${won}`}
      />
    );
  }

  render() {
    return (
      <div className="square-holder">
        {
          _.times(9, (i) => {
            return this.renderSquare(i);
          })
        }
      </div>
    );

  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      },],
      stepNumber: 0,
      xIsNext: true,
      winningLine: null,
      winner: null,
    };
  }

  calculateWinner(squares) {
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
        this.setState({
          winner: squares[a],
          winningLine: lines[i],
        });
        return squares[a];
      }
    }

    let counter = 0;
    squares.forEach((item, i) => {
      if (item !== null) {
        counter++;
      }
    });

    if (counter === squares.length) {
      this.setState({
        even: true,
      });
    }

    this.setState({
      winner: null,
      winningLine: null,
    });
    return null;
  }

  handleClick(i) {
    // TODO if I go back to winner step the game cannot continue
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (squares[i] || this.state.winner) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
      history: history.concat([{
        squares: squares,
        position: getPosition(i),
      },]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });

    if (this.calculateWinner(squares)) {
      return;
    }
  }

  jumpTo(step) {
    const history = this.state.history.slice(0, step);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    this.calculateWinner(squares);
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  highlight(position) {
    return position === this.state.stepNumber ? 'highlight' : '';
  }

  sort() {
    // Add action on sort button click

    this.setState({
      history: this.state.history.slice(0).reverse(),
      reverse: !this.state.reverse,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = this.state.winner;

    const moves = history.map((step, move) => {
      let move_for_display = this.state.reverse ?
        history.length - 1 - move :
        move;
      const desc = step.position ?
        'Back to round n°' + move_for_display + ' ' + step.position :
        'Back to beginning';
      return (
        <li key={move}>
          <button className={this.highlight(move)} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = winner + ' won.';
    } else if (this.state.even) {
      status = 'Everybody lose - try again';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            winningLine={this.state.winningLine}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status} - <button className='sort' onClick={() => this.sort()}>Sort</button></div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function getPosition(i) {
  let pos;
  switch (i) {
    case 0:
      pos = '(1, 1)';
      break;
    case 1:
      pos = '(2, 1)';
      break;
    case 2:
      pos = '(3, 1)';
      break;
    case 3:
      pos = '(2, 1)';
      break;
    case 4:
      pos = '(2, 2)';
      break;
    case 5:
      pos = '(2, 3)';
      break;
    case 6:
      pos = '(3, 1)';
      break;
    case 7:
      pos = '(3, 2)';
      break;
    case 8:
      pos = '(3, 3)';
      break;
    default:
      pos = 'Something went wrong';
  }
  return pos;
}
