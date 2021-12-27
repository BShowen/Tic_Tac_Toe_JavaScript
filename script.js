const players = ((p1, p2) => {
  // Factory function for creating players. 
  const player = (name, symbol) => {
    // Store players positions in an array. 
    const _positions = [];
    const getName = () => {
      return name;
    }
    const getSymbol = () => {
      return symbol;
    }
    const addPosition = (n) => {
      _positions.push(n);
    }
    // Return a copy of the player's positions. 
    const getPositions = () => {
      return JSON.parse(JSON.stringify(_positions));
    }
    // Expose necessary functions. 
    return { getName, getSymbol, getPositions, addPosition };
  }
  // Store player objects in an array. 
  const _players = [player(p1, "X"), player(p2, "O")];
  // Index to retrieve players from the _players array. This index toggles between 0 and 1. 
  let currentTurn = 1;
  // Set the next player. 
  const nextPlayer = () => {
    currentTurn = ++currentTurn % 2; //Always toggle between 1 and 0. 
    return currentPlayer();
  }
  // Return the current turn player
  const currentPlayer = () => {
    return _players[currentTurn]; 
  }
  return { nextPlayer, currentPlayer }
})("Bradley", "Jennifer");


// A module for the game board. 
const gameBoard = ((board) => {
  const _handlePlayerClick = function(sqr){
    // Add position to the current player's list of positions. 
    const player = players.currentPlayer();
    const position = parseInt(sqr.target.id);
    player.addPosition(position);
    // Set the symbol for the clicked square. 
    sqr.target.innerText = player.getSymbol();
    // Toggle the next player's turn. 
    game.nextMove();
  }

  const getBoard = () => {
    return board;
  }

  // Add a click event listener to each square on the board. 
  const render = () => {
    board.forEach( sqr => { 
      // Game rules. A square can be clicked on only once. 
      sqr.addEventListener("click", _handlePlayerClick.bind(sqr), {once: true});
    });
  }
  return { render, getBoard };
})(document.querySelectorAll("#gameBoard > *"));



const game = (() => {
  let currentMoves = 0;
  //The amount of moves before a tie occurs. 
  const MAX_MOVES = 9; 
  const WINNING_POSITIONS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  
  const isWinner = () => {
    let didWin = false
    WINNING_POSITIONS.forEach( winningPosition => {
      if(winningPosition.every(_positionInPlayerPosition)){
        didWin = true;
      }
    });
    return didWin;
  }

  const _positionInPlayerPosition = (n) => {
    return players.currentPlayer().getPositions().includes(n);;
  }

  const isTie = () => {
    return currentMoves >= MAX_MOVES;
  }

  const nextMove = () => {
    ++currentMoves;
    if(isWinner()){
      alert(`${players.currentPlayer().getName()} is the winner!`);
    }else if(isTie()){
      alert("It is a tie!");
    }else{
      players.nextPlayer();
    }
  }

  const start = () => {
    gameBoard.render();
  }

  return { start, nextMove }

})();



game.start();