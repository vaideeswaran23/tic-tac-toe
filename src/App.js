import {useState} from "react";

function Square({value, onSquareClick, isWinningSquare}) {

    return (
        <>
            {
                isWinningSquare ?
                    <button
                        className="square winning-square"
                        onClick={onSquareClick}
                    >
                        {value}
                    </button>
                    :
                    <button
                        className="square"
                        onClick={onSquareClick}
                    >
                        {value}
                    </button>
            }
        </>

    );
}

export function Board({xIsNext, squares, onPlay, currentMove}) {


    function handleClick(i, clickedBox) {
        if (squares[i] || calculateWinner(squares)[0])
            return;
        const nextSquares = squares.slice();
        if (xIsNext)
            nextSquares[i] = 'X';
        else
            nextSquares[i] = 'O';
        nextSquares[9] = clickedBox;
        onPlay(nextSquares);
    }

    const [winner, winningSquares] = calculateWinner(squares);
    let status;
    if (winner) {
        status = "Winner: " + winner;
    } else {
        status = "Next player: " + (xIsNext ? "X" : "O");
    }
    let draw;
    if(currentMove === 9)
        draw = "Game ends in a draw"

    const rows = [[0,1,2], [3,4,5], [6,7,8]].map((row, index) => {
        return (
            <div className="board-row" key={index}>
                <Square
                    value={squares[row[0]]}
                    onSquareClick={() => handleClick(row[0], [index, row[0]%3])}
                    isWinningSquare={winningSquares && winningSquares.includes(row[0])}
                />
                <Square
                    value={squares[row[1]]}
                    onSquareClick={() => handleClick(row[1], [index, row[1]%3])}
                    isWinningSquare={winningSquares && winningSquares.includes(row[1])}
                />
                <Square
                    value={squares[row[2]]}
                    onSquareClick={() => handleClick(row[2], [index, row[2]%3])}
                    isWinningSquare={winningSquares && winningSquares.includes(row[2])}
                />
            </div>
        )
    })

    return (
        <>
            <div className="status">{draw ? draw : status}</div>
            <div className="status">{`You are at move # ${currentMove}`}</div>
            {rows}
        </>
    );
}

export default function Game() {

    const [history, setHistory] = useState([Array(10).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];

    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }

    const moves = history.map((squares, move) => {
        let description;
        if (move > 0)
            description = "Go to move #" + move + " => (" + squares[9] + ")";
        else
            description = "Go to game start";
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{description}</button>
            </li>
        )
    })

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} currentMove={currentMove}/>
            </div>
            <div className="game-info">
                <ol>{moves}</ol>
            </div>
        </div>
    )
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
            return [squares[a], lines[i]];
    }
    return [null, null];
}