const emitter = (function (){
  const events = {}

  const on = function(eventName, callBack){
    events[eventName] = events[eventName] || [];
    events[eventName].push(callBack);
  }

  const emit = function(eventName, data){
    if(events[eventName]){
      events[eventName].forEach( function(callBack){
        callBack(data);
      }); 
    }
  }

  const off = function(eventName, callBack){
    if(events[eventName] && events[eventName].includes(callBack)){
      const eventsList = events[eventName];
      const index = events[eventName].indexOf(callBack);
      eventsList.splice(index, 1);
      // Remove the eventName list if it's now empty. 
      if(eventList.length == 0){
        delete eventList[eventName];
      }
    }
  } 

  return { on, off, emit, events }
})();

const scoreCards = (function(){
  const scoreCard = function(scoreCardElement){
    const updateScoreCard = function(){
      const currentScore = parseInt(scoreCardElement.innerText);
      scoreCardElement.innerText = (currentScore + 1);
    }
    return { updateScoreCard }
  };
  
  const playerXScoreCard = scoreCard(document.querySelector("#playerXScoreCard"));
  emitter.on("playerXScoreIncrease", playerXScoreCard.updateScoreCard );

  const playerOScoreCard = scoreCard(document.querySelector("#playerOScoreCard"));
  emitter.on("playerOScoreIncrease", playerOScoreCard.updateScoreCard );
})();

const players = (function(){
  
  // Factory function for creating players. 
  const player = function(name, symbol){
    // Store players positions in an array. 
    const _positions = [];
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

    // Expose necessary functions. 
    return { getName, getSymbol, getPositions, addPosition };
  }


  // Store player objects in an array. 
  let _players = [player("playerX", "X"), player("playerO", "O")];
  // Index to retrieve players from the _players array. This index toggles between 0 and 1. 
  let _currentTurn = 0;
  // Set the next player. 
  const _nextPlayer = function(){
    _currentTurn = ++_currentTurn % 2; //Always toggle between 1 and 0. 
    return getCurrentPlayer();
  }
  // Return the current turn player
  const getCurrentPlayer = function(){
    return _players[_currentTurn]; 
  }
  const _reset = function(){
    _currentTurn = 0;
    _players = null;
    _players = [player("playerX", "X"), player("playerO", "O")];
  }

  emitter.on("reset", _reset);
  emitter.on("nextTurn", _nextPlayer);
  return { getCurrentPlayer }
})();


// A module for the game board. 
const gameBoard = (function(board){

  const _handlePlayerClick = function (){
    // Add position to the current player's list of positions. 
    const player = players.getCurrentPlayer();
    const position = parseInt(this.dataset.id);
    player.addPosition(position);
    // Set the symbol for the clicked square. 
    this.innerText = player.getSymbol();
    // Toggle the next player's turn. 
    emitter.emit("nextMove");
  }

  const _endGame = function(){
    board.forEach(function(sqr){
      sqr.removeEventListener("click", _handlePlayerClick, {once: true});
    });
  }

  // Add a click event listener to each square on the board. 
  const _render = function(){
    board.forEach( function(sqr){ 
      sqr.innerText = null;
      // Game rules. A square can be clicked on only once.
      sqr.addEventListener("click", _handlePlayerClick, {once: true});
    });
  }

  emitter.on("reset", _render);
  emitter.on("startGame", _render);
  emitter.on("endGame", _endGame);
})(document.querySelectorAll("#gameBoard > *"));



const game = (function(){
  let currentMoves = 0;
  //The amount of moves before a tie occurs. 
  const MAX_MOVES = 9; 
  const WINNING_POSITIONS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  
  const _isWinner = function(){
    let didWin = false
    WINNING_POSITIONS.forEach( winningPosition => {
      if(winningPosition.every(_positionInPlayerPosition)){
        didWin = true;
      }
    });
    return didWin;
  }

  const _positionInPlayerPosition = function(n){
    return players.getCurrentPlayer().getPositions().includes(n);
  }

  const _isTie = function(){
    return currentMoves >= MAX_MOVES;
  }

  const _nextMove = function(){
    ++currentMoves;
    if(_isWinner()){
      if(players.getCurrentPlayer().getName() == "playerX"){
        emitter.emit("playerXScoreIncrease");
        emitter.emit("endGame");
      }else{
        emitter.emit("playerOScoreIncrease");
        emitter.emit("endGame");
      }
    }else if(_isTie()){
      emitter.emit("endGame");
    }else{
      emitter.emit("nextTurn");
    }
  }

  const _reset = function(){
    currentMoves = 0;
  }

  emitter.on("nextMove", _nextMove);
  emitter.on("reset", _reset);

})();

(function (){
  const buttonElement = document.querySelector(".buttonContainer > button");
  buttonElement.addEventListener("click", () => {
    emitter.emit("reset");
  });
})();


emitter.emit("startGame");