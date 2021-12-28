const players = (function(p1, p2){
  
  // Factory function for creating players. 
  const player = function(name, symbol){
    // Store players positions in an array. 
    const _positions = [];
    let _score = 0;
    const getName = function(){
      return name;
    }
    const getSymbol = function(){
      return symbol;
    }
    const addPosition = function(n){
      _positions.push(n);
    }
    // Return a copy of the player's positions. 
    const getPositions = function(){
      return JSON.parse(JSON.stringify(_positions));
    }
    // Return a copy of the score. 
    const getScore = function(){
      return _score;  
    }
    // Increase the score by 1 point
    const increaseScore = function(){
      _score++;
    }
    // Expose necessary functions. 
    return { getName, getSymbol, getPositions, addPosition, getScore, increaseScore };
  }


  // Store player objects in an array. 
  let _players = [player(p1, "X"), player(p2, "O")];
  // Index to retrieve players from the _players array. This index toggles between 0 and 1. 
  let _currentTurn = 0;
  // Set the next player. 
  const nextPlayer = function(){
    _currentTurn = ++_currentTurn % 2; //Always toggle between 1 and 0. 
    return currentPlayer();
  }
  // Return the current turn player
  const currentPlayer = function(){
    return _players[_currentTurn]; 
  }
  const reset = function(){
    _currentTurn = 0;
    _players = null;
    _players = [player(p1, "X"), player(p2, "O")];
  }
  return { nextPlayer, currentPlayer, reset }
})("Bradley", "Jennifer");


// A module for the game board. 
const gameBoard = (function(board){
  const _handlePlayerClick = function (){
    // Add position to the current player's list of positions. 
    const player = players.currentPlayer();
    const position = parseInt(this.dataset.id);
    player.addPosition(position);
    // Set the symbol for the clicked square. 
    this.innerText = player.getSymbol();
    // Toggle the next player's turn. 
    game.nextMove();
  }

  const reset = function(){
    players.reset();
    game.reset();
    render();  
  }

  // Add a click event listener to each square on the board. 
  const render = function(){
    board.forEach( function(sqr){ 
      sqr.innerText = null;
      // Game rules. A square can be clicked on only once.
      sqr.addEventListener("click", _handlePlayerClick, {once: true});
    });
  }
  return { render, reset };
})(document.querySelectorAll("#gameBoard > *"));



const game = (function(){
  let currentMoves = 0;
  //The amount of moves before a tie occurs. 
  const MAX_MOVES = 9; 
  const WINNING_POSITIONS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  
  const isWinner = function(){
    let didWin = false
    WINNING_POSITIONS.forEach( winningPosition => {
      if(winningPosition.every(_positionInPlayerPosition)){
        didWin = true;
      }
    });
    return didWin;
  }

  const _positionInPlayerPosition = function(n){
    return players.currentPlayer().getPositions().includes(n);;
  }

  const isTie = function(){
    return currentMoves >= MAX_MOVES;
  }

  const nextMove = function(){
    ++currentMoves;
    if(isWinner()){
      players.currentPlayer().increaseScore();
      console.log(`${players.currentPlayer().getName()} is the winner!`);
    }else if(isTie()){
      console.log("It is a tie!");
    }else{
      players.nextPlayer();
    }
  }

  const start = function(){
    gameBoard.render();
  }

  const reset = function(){
    currentMoves = 0;
  }

  return { start, nextMove, reset }

})();

(function (){
  const buttonElement = document.querySelector(".buttonContainer > button");
  buttonElement.addEventListener("click", () => {
    gameBoard.reset();
  })
})();



game.start();