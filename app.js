(function() {

    let gameBoardFlag = true;

    let displayController = (() => {
        let players = [];
        let playerOne;
        let playerTwo;
        let playerTurn;

        init = () => {
            this.cacheDom();
            this.bindEvents();
        };

        cacheDom = () => {
            this.buttons = document.querySelectorAll('.modal-btn');
            this.playButton = document.querySelector('#play-btn');
            this.modal2p = document.querySelector('#modal-2p');
            this.modalGame = document.querySelector('#modal-game');
            this.inputOne = document.querySelector('#player-1-name');
            this.inputTwo = document.querySelector('#player-2-name');
            this.currentPlayer = document.querySelector('#current-player');
            this.scoreBoard = document.querySelector('#scoreboard');
            this.p1Score = document.querySelector('#p1-score');
            this.p2Score = document.querySelector('#p2-score');
        };

        bindEvents = () => {
            this.buttons.forEach((btn) => {
                btn.addEventListener('click', this.makePlayChoice.bind(this));
            });
            this.playButton.addEventListener('click', this.createPlayers.bind(this));
        };

        makePlayChoice = (event) => {
            if(event.target.id === '2-player-btn') {
                console.log('2-player-init');
                this.toggleModal(this.modalGame);
                this.toggleModal(this.modal2p);
            }
            else {
                //NEED TO MAKE AI (OPTIONAL)
                console.log('ai-init');
                this.toggleModal();
            }
        };

        toggleModal = (modal) => {
            if(modal.classList.contains('hidden')){
                modal.classList.remove('hidden');
                modal.style.display = 'flex';
            }
            else {
                modal.classList.add('hidden');
                modal.style.display = 'none';
            }
        };

        createPlayers = () => {
            playerOne = playerFactory(this.inputOne.value, 'X');
            playerOne.setCurrentPlayer(true);
            playerTwo = playerFactory(this.inputTwo.value, 'O');
            this.toggleModal(this.modal2p);
            players.push(playerOne);
            players.push(playerTwo);
            gameBoard(gameBoardFlag);
            this.displayCurrentPlayer();
            this.displayScoreboard();
            this.updateScoreboard();
        };

        clearPlayers = () => {
            players = [];
            this.inputOne.value = "";
            this.inputTwo.value = "";
        }

        hideCurrentPlayer = () => {
            this.currentPlayer.classList.add('hidden');
            this.currentPlayer.textContent = "";
        };

        toggleCurrentPlayer = () => {
            for(let i = 0; i < players.length; i++) {
                if(players[i].getCurrentPlayer() === true) {
                    players[i].setCurrentPlayer(false);
                }
                else{
                    players[i].setCurrentPlayer(true);
                    this.playerTurn = players[i];
                }
            }

            this.displayCurrentPlayer()
        };

        getCurrentPlayer = () => {
            for(let i = 0; i < players.length; i++) {
                if(players[i].getCurrentPlayer() === true) {
                    return players[i];
                }
            }
        };

        getPlayers = () => {
            return players;
        };

        displayCurrentPlayer = () => {
            for(let i = 0; i < players.length; i++) {
                if(players[i].getCurrentPlayer() === true) {
                    this.currentPlayer.classList.remove('hidden');
                    this.currentPlayer.textContent = `${players[i].getName()}'s turn`;
                }
            }
        };

        displayWinner = (winner) => {
            this.currentPlayer.textContent = `${winner.getName()} wins!`;
        };

        displayTie = () => {
            this.currentPlayer.textContent = "Cat's Game!";
        };

        displayScoreboard = () => {
            this.scoreBoard.classList.remove('hidden');
        };

        updateScoreboard = () => {
            this.p1Score.textContent = `${players[0].getName()}: ${players[0].getWins()}`;
            this.p2Score.textContent = `${players[1].getName()}: ${players[1].getWins()}`;
        };

        this.init();

        return {getPlayers, clearPlayers, toggleCurrentPlayer, getCurrentPlayer, hideCurrentPlayer, displayWinner, displayTie, updateScoreboard};
    })();

    let playerFactory = (name, symbol) => {
        let isCurrent = false;
        let symbolIndices = [];
        let turnsTaken = 0;
        let wins = 0;

        const getName = () => {
            return name;
        };

        const getCurrentPlayer = () => {
            return isCurrent;
        };
        
        const setCurrentPlayer = (value) => {
            isCurrent = value;
        };

        const getSymbol = () => {
            return symbol;
        };

        const addIndex = (index) => {
            symbolIndices.push(index);
        };

        const getIndices = () => {
            return symbolIndices;
        };

        const clearIndices = () => {
            symbolIndices = [];
        }

        const incrementTurns = () => {
            turnsTaken += 1;
        };

        const getTurnsTaken = () => {
            return turnsTaken;
        };

        const resetTurnsTaken = () => {
            turnsTaken = 0;
        }

        const incrementWins = () => {
            wins += 1;
        }

        const getWins = () => {
            return wins;
        }

        return {getName, setCurrentPlayer, getCurrentPlayer, getSymbol, getWins, addIndex, getIndices,
                getTurnsTaken, incrementTurns, incrementWins, resetTurnsTaken, clearIndices};
    };

    let gameBoard = ((gameBoardFlag) => {
        let _board = ['', '' , '', '', '', '', '', '', ''];
        const winConditions = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], 
                            [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
        let totalTurns = 0;
        let players = displayController.getPlayers();

        init = () => {
            this.createBoard();
            this.cacheDom();
            this.bindFunctions();
            this.bindEvents();
        };

        createBoard = () => {
            for(let i = 0; i < 9; i++) {
                this.myBoard = document.getElementById('board');
                const div = document.createElement('div');
                div.classList.add('cell');
                div.setAttribute('id', `c${i}`);
                this.myBoard.appendChild(div);
            }
        };

        resetBoard = () => {
            this.divs.forEach((div) => {
                div.textContent = "";
            });
        };

        cacheDom = () => {
           this.myBoard = this.myBoard;
           this.divs = document.querySelectorAll('.cell');
           this.symbols = document.querySelectorAll('.symbol');
           this.reset = document.querySelector('#reset-btn');
           this.replay = document.querySelector('#replay-btn');
        };

        // Note: This function makes a single instance of the takeTurn function so
        // that unbindEvents works. Previously unbindEvents wasn't working because 
        // bind(this) changes the signature of the function (from StackOverflow)
        bindFunctions = () => {
            this.turnFunction = this.takeTurn.bind(this);
        };

        bindEvents = () => {
            this.divs.forEach((div) => {
                div.addEventListener('click', this.turnFunction);
            });
            this.reset.addEventListener('click', this.resetGame.bind(this));
            this.replay.addEventListener('click', this.replayGame.bind(this));
        };

        unbindEvents = () => {
            console.log("unbinding events");
            this.divs.forEach((div) => {
                div.removeEventListener('click', this.turnFunction);
            });
        };

        takeTurn = (event) => {
            console.log("taking turn");
            let currentPlayer = displayController.getCurrentPlayer();
            let ind = parseInt(event.target.id.substring(1));
            if(validMove(ind)) {
                this.divs[ind].textContent = currentPlayer.getSymbol();
                this.divs[ind].classList.add('occupied');
                _board[ind] = currentPlayer.getSymbol();
                currentPlayer.addIndex(ind);
                currentPlayer.incrementTurns();
                displayController.toggleCurrentPlayer();
                totalTurns += 1;
            } else {
                return;
            }
            if(currentPlayer.getTurnsTaken() >= 3) evalWin(currentPlayer);
        };

        validMove = (index) => {
            if(_board[index] === "") {
                return true;
            } else {
                return false;
            }
        };

        evalWin = (player) => {
            let indices = player.getIndices();

            for(let i = 0; i < winConditions.length; i++) {
                let isSubArr = winConditions[i].every(e => indices.includes(e));
                if(isSubArr) {
                    player.incrementWins();
                    displayController.updateScoreboard();
                    displayController.displayWinner(player);
                    this.unbindEvents();
                    return;
                }
            }

            if(totalTurns === 9) {
                this.unbindEvents();
                displayController.displayTie();
            }
        };

        resetGame = () => {
            window.location.reload();
            return false;
        };

        replayGame = () => {
            _board = ['', '' , '', '', '', '', '', '', ''];
            totalTurns = 0;
            displayController.toggleCurrentPlayer();
            this.resetBoard();
            this.bindEvents();
            for(let i = 0; i < players.length; i++) {
                players[i].clearIndices();
                players[i].resetTurnsTaken();
            }
            this.divs.forEach((div) => {
                div.classList.remove('occupied');
            });
        };

        this.init();
    });
})();
