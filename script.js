// press ESCAPE key for pause
// if you gain more than other recorders your record will be published
// rows and cells size can be changed just dont put less than 5 rows and cells

// game menu buttons
let startBtn = document.querySelector("#start_btn");
let resumeBtn = document.querySelector("#resume_btn");
let restartBtn = document.querySelector("#restart_btn");
let restartBtn2 = document.querySelector("#restart_btn2");

// game visual board
let boardElement = document.querySelector("#board")

//  game menus
let startMenu = document.querySelector("#start_menu");
let pauseMenu = document.querySelector("#pause_menu");
let gameoverMenu = document.querySelector("#gameover_menu");

//  game info fields 
let score = document.querySelector("#score_field");
let level = document.querySelector("#level_field");
let lines = document.querySelector("#lines_field");
// game starting info fields starting values
// hint: will be evalueted during game
let levelsCount = 1;
let linesCount = 0;
let scoreCount = 0;
let id;

// figure drop speed
let delay = 900;

let soundDisableBtn = document.querySelector("#sound_disable");
let soundEnableBtn = document.querySelector("#sound_enable")


// for adding record after game over
let newRecordBlock = document.querySelector("#new_record")
let recordsItems = Array.from(document.querySelectorAll(".rec-list-item"));
let recordNameInput = document.querySelector("#new_record_name");
let winnerPlace;
// keys and buttons event listeners

//next figure board Element
let upcomingFigureBoard = document.querySelector("#upcoming_figure_board");

startBtn.addEventListener("click", onStart);
resumeBtn.addEventListener("click", onResume);
document.addEventListener("keydown", onEscapeKey);
restartBtn.addEventListener("click", onRestart);
restartBtn2.addEventListener("click", onRestart);
soundDisableBtn.addEventListener("click", onSoundOff);
soundEnableBtn.addEventListener("click", onSoundOn);

// game sounds
let audioTetrisTheme = document.querySelector("#tetris_song");
let audioButtonUp = document.querySelector("#audio_button_up");
let audioGameOver = document.querySelector("#audio_game_over");
let audioGameStart = document.querySelector("#audio_game_start");
let audioFigureRotate = document.querySelector("#audio_figure_rotate");
let audioFigureRotateFail = document.querySelector("#audio_figure_rotate_fail");
let audioLevelUp = document.querySelector("#audio_level_up");
let audioFigureTouchDown = document.querySelector("#audio_figure_touch_down");
let audioFigureTouchHlr = document.querySelector("#audio_figure_touch_hlr");
let audioFigureTouchLr = document.querySelector("#audio_figure_touch_lr");
let audioFigureFall = document.querySelector("#audio_figure_fall");
let audioClearSingle = document.querySelector("#audio_clear_single");
let audioClearDouble = document.querySelector("#audio_clear_double");
let audioClearTriple = document.querySelector("#audio_clear_triple");
let audioFigureMoveLR = document.querySelector("#audio_figure_move_lr");

// decrease volume of music
audioTetrisTheme.volume = 0.1;
// loop music when finished
audioTetrisTheme.loop = true;

// game primary color
let primaryColor = "#7f7f7f";
primaryColor = "#444";

const figures = [
    {
        shape:           [[0,0,0,0],
                          [1,1,1,1],
                          [0,0,0,0],
                          [0,0,0,0]],
        color: "#5BC2E7"
    },

    {
        shape:           [[0,1,1],
                          [1,1,0],
                          [0,0,0]],
        color: "#41b45c"                  
    },

    {
        shape:           [[1,1,0],
                          [0,1,1],
                          [0,0,0]],                  
        color: "#F93822"
    },

    {
        shape:           [[0,0,0,0],
                          [0,1,1,0],
                          [0,1,1,0],
                          [0,0,0,0]],
        color: "#fedd00"                  
    },

    {
        shape:           [[0,1,0],
                          [1,1,1],
                          [0,0,0]],
        color: "#af70ff"
    },

    {
        shape:           [[1,1,1],
                          [1,0,0],
                          [0,0,0]],        
        color: "#307FE2"
    },

    {
        shape:           [[0,0,1],
                          [1,1,1],
                          [0,0,0]],
        color: "#E87722"                  
    },
];

// shufling figures
// comment for me should not be here
let figuresShuffled = shuffleFigures(figures);

// after shuffling figures we take figure
// from figures array one by one untill it
// will be empty and if it is empty we shuffle array again
let currentFigure = figuresShuffled.shift(); 
let figureShape = copyFigure(currentFigure.shape);

let currentFigurePositions = {
    left: 10 / 2  - 2,
    top: 0,
    right: 10 / 2 - 2 + currentFigure.shape[0].length - 1,
    bottom: 0 + currentFigure.shape.length - 1
}



let tetrisInfoElement = document.querySelector("#tetris_info");
// sizes of board
let rowsSize = 20;
let cellsSize = 10;
// for entering pause menu
let isPaused = false;
let isEscapeKeyPressed = false;
//first creating array with cells for board
//short hint: doing this operation on start and on restart
let board = initboard(rowsSize, cellsSize);
// then creating array with div elements to visualizing them in future
// short hint: doing operation only on start ans on restart
let visualBoard = initVisualBoard(rowsSize, cellsSize)
// adding html structure of board from js dinamically
// short hint: one time operation
showBoard(visualBoard, rowsSize, cellsSize);

// show next upcoming figure on screen
showUpcomingFigure(figuresShuffled[0]);

// when click start button
async function onStart(event) {
    // begin game
    // start music from 3rd second
    audioTetrisTheme.currentTime = 3;
    audioTetrisTheme.play();
    // comment for me should not be here
// adding figure to top of the boardsSize);
    startMenu.classList.toggle("my-d-none");
    boardElement.classList.toggle("my-d-none");
    upcomingFigureBoard.classList.toggle("my-d-none")
    tetrisLifeCicle();
}

// game starts here 
async function tetrisLifeCicle() {    
    // comment for me should not be here
    // adding figure to top of the board
    addNextFigureToBoard(board, visualBoard, currentFigure, cellsSize);
    document.addEventListener("keydown", onKeydown); 
    
    update();
    // update game every time depending on level speed
    async function update() {
        if (!isPaused) {
            let isBottomEdge = moveFigureDown(board, visualBoard, currentFigure);
                
            if (isBottomEdge === null) {
                
                findCompletedRows(board, visualBoard, currentFigure);
            
                if (figuresShuffled.length <= 3) {
                    figuresShuffled = figuresShuffled.concat(shuffleFigures(figures));
                }
                
                currentFigure = figuresShuffled.shift();
                figureShape = copyFigure(currentFigure.shape);
                showUpcomingFigure(figuresShuffled[0]);
                
                let isGameOver = addNextFigureToBoard(board,visualBoard, currentFigure, cellsSize);
                if (isGameOver) {
                    await gameOverTimeout(500);
                    addNewRecord();
                    clearTimeout(id);
                    document.removeEventListener("keydown",onKeydown);
                    upcomingFigureBoard.innerHTML = "";
                    return;
                }
                
            }
        }

        // update timer
        id = setTimeout(update,delay);
    }
}

function onEscapeKey(event) {
    if (event.key === "Escape") {
        if (!isEscapeKeyPressed) {
            // pause game
            audioTetrisTheme.pause();
            isPaused = true;
            isEscapeKeyPressed = true;
            boardElement.classList.toggle("my-d-none");
            pauseMenu.classList.toggle("my-d-none");

            document.removeEventListener("keydown", onKeydown);

        } else {
            
            onResume();
        }
    }    
}



async function onKeydown(event) {
    switch (event.key) {
        case "ArrowUp":
            rotateFigure(board, visualBoard, currentFigure);
            break;
        case "ArrowLeft":
            moveFigureLeft(board, visualBoard, currentFigure);
            break;
        case "ArrowRight":
            moveFigureRight(board,visualBoard, currentFigure);
            break;
        case "ArrowDown": {
            let isBottomEdge = moveFigureDown(board, visualBoard, currentFigure);
            // if figure touched bottom edge
            if (isBottomEdge === null) {
                // check completed rows
                findCompletedRows(board, visualBoard, currentFigure);
                // if no figures in queue add again
                if (figuresShuffled.length <= 3) {
                    figuresShuffled = figuresShuffled.concat(shuffleFigures(figures));
                }
                // get copy of current figure
                currentFigure = figuresShuffled.shift();
                figureShape = copyFigure(currentFigure.shape)

                // show next figure in next figure block
                showUpcomingFigure(figuresShuffled[0]);
                
                // if cant add figure the game is over
                let isGameOver = addNextFigureToBoard(board,visualBoard, currentFigure, cellsSize);
                if (isGameOver) {
                    // waiting x ms
                    await gameOverTimeout(500); 
                    return
                }

            }

            // fast drop increasing score
            score.innerText = scoreCount++;
            break;
        }
                    
    }
}

async function gameOverTimeout (ms) {
     document.removeEventListener("keydown", onKeydown);
     clearTimeout(id);
     await new Promise(res => setTimeout(() => {
        boardElement.classList.toggle("my-d-none");
        gameoverMenu.classList.toggle("my-d-none");
        
        addNewRecord();
        audioTetrisTheme.pause();
        audioTetrisTheme.currentTime = 3;
        audioGameOver.play();
     }, ms));
}

function onRestart(event) {
    // stop prev lifecycle
    clearTimeout(id);
    upcomingFigureBoard.innerHTML = "";

    figuresShuffled = shuffleFigures(figures);
    let currentFigure = figuresShuffled.shift();
    
    currentFigurePositions = {
        left: 10 / 2  - 2,
        top: 0,
        right: 10 / 2 - 2 + currentFigure.shape[0].length - 1,
        bottom: 0 + currentFigure.shape.length - 1
    }

    board = initboard(rowsSize, cellsSize);
    visualBoard = initVisualBoard(rowsSize, cellsSize);
    showBoard(visualBoard,rowsSize,cellsSize,currentFigure);
    showUpcomingFigure(figuresShuffled[0]);
    
    score.innerText = "0";
    level.innerText = "1";
    lines.innerText = "0";
    scoreCount = 0;
    linesCount = 0;
    levelsCount = 1;

    pauseMenu.classList.add("my-d-none");
    gameoverMenu.classList.add("my-d-none");
    boardElement.classList.remove("my-d-none");
    
    // reset delay
    delay = 900;

    // add new lifecycle
    tetrisLifeCicle();
    
    isPaused = false;
    isEscapeKeyPressed = false;
    audioTetrisTheme.currentTime = 3;
    audioTetrisTheme.play();
}

function onResume() {
    audioTetrisTheme.play();
    isPaused = false;
    isEscapeKeyPressed = false;
    // re adding controls listeners
    document.addEventListener("keydown", onKeydown);
    
    boardElement.classList.toggle("my-d-none");
    pauseMenu.classList.toggle("my-d-none");
}

function onSoundOff(event) {
    soundDisableBtn.classList.toggle("my-d-none");
    soundEnableBtn.classList.toggle("my-d-none");

    audioTetrisTheme.muted = true;
    audioFigureMoveLR.muted = true;
    audioFigureFall.muted = true;
    audioFigureRotate.muted = true;
    audioFigureRotateFail.muted = true;
    audioFigureTouchLr.muted = true;
    audioClearSingle.muted = true;
    audioClearDouble.muted = true;
    audioClearTriple.muted = true;
    audioGameOver.muted = true;
}

function onSoundOn(event) {
    soundDisableBtn.classList.toggle("my-d-none");
    soundEnableBtn.classList.toggle("my-d-none");
    audioTetrisTheme.muted = false;
    audioFigureTouchHlr.muted = false;
    audioFigureMoveLR.muted = false;
    audioFigureFall.muted = false;
    audioFigureRotate.muted = false;
    audioFigureRotateFail.muted = false;
    audioFigureTouchLr.muted = false;
    audioClearSingle.muted = false;
    audioClearDouble.muted = false;
    audioClearTriple.muted = false;
    audioGameOver.muted = false;
}

function initboard(rowsSize, cellsSize) {
    let board = [];
    // creating matrix
    for (let i = 0; i < rowsSize; i++) {
        board[i] = [];

        for (let j = 0; j < cellsSize; j++) {
            // filling cells with zero 
            // whic mean it empty cell
            board[i][j] = 0;
        }
    }

    return board;
}


function initVisualBoard(rowsSize,cellsSize) {
    let visualBoard = [];
    // matrix
    for (let i = 0; i < rowsSize; i++) {
        visualBoard[i] = [];
        // create board cells
        for (let j = 0; j < cellsSize; j++) {
            visualBoard[i][j] = document.createElement("div");
        }
    }

    return visualBoard;
}

//  appending board rows and cells to the HTML board 
function showBoard(visualBoard, rowsSize, cellsSize, currentFigure) {
    let boardElementChildren = Array.from(boardElement.children);
    for (let i = 0; i < boardElementChildren.length; i++) {
        boardElement.removeChild(boardElement.firstChild);
    }
    
    for (let i = 0; i < rowsSize; i++) {
        // creating row each iteration, to put cells in it
        let boardRow = document.createElement("div");
        boardRow.classList.add("tetris__board-row")
        
        for (let j = 0; j < cellsSize; j++) {
            visualBoard[i][j].classList.add("tetris__board-cell");
            // visualBoard[i][j].style.width = `${280 /  cellsSize}px`;
            boardRow.style.height = `calc(100% / ${rowsSize})`;
            // visualBoard[i][j].style.height = `calc(100% / ${rowsSize})`;
            boardRow.append(visualBoard[i][j]);
        }

        boardElement.append(boardRow);
    }
}

function shuffleFigures(figures) {
    // copy of figures to prevent source figures change
    let figuresCopy = figures.slice();
    for (let i = figuresCopy.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let tmp = figuresCopy[i];
        figuresCopy[i] = figuresCopy[j];
        figuresCopy[j] = tmp;
    }
    
    return figuresCopy;
}

// adding figure on top of the board
function addNextFigureToBoard(board, visualBoard, currentFigure, cellsSize) {
    let figure = currentFigure.shape;
    // starting positions
    currentFigurePositions.left = 10 / 2 - 2;
    currentFigurePositions.right = currentFigurePositions.left + figure[0].length - 1;
    currentFigurePositions.top = 0;
    currentFigurePositions.bottom = currentFigurePositions.top + figure.length - 1;
    
    let left = currentFigurePositions.left;
    let right = currentFigurePositions.right;
    let top = currentFigurePositions.top;
    let bottom = currentFigurePositions.bottom;


    let restEmptyLinesCount = 0;
    // we need current figure sides indexes
    // to put figure in correct place in board matrix
    if (!isFigureFitTheSpaceOnBoard()) {
        // game over
    
        fillRestSpace();
        return true;
    }

    // there is enough space on board
    // to fit figure
    // hint: adding figure to board
    let k = 0;
   
    for (let i = top; i <= bottom; i++) {
        let l = 0;
        for (let j = left; j <= right; j++) {
            if (figure[k][l] === 1) {
                board[i][j] = 1;
                visualBoard[i][j].style.backgroundColor = currentFigure.color;
                visualBoard[i][j].classList.add("border-alpha");
            }
            
            l++;
        }
        k++;
    }
    
    function isFigureFitTheSpaceOnBoard() {
        // iterating on figure matrix
        for (let i = 0; i < figure.length; i++) {
            for (let j = 0; j < figure[0].length; j++) {
                // if the current figure
                // isnt fit board empty space 
                if (figure[i][j] === 1) { 
                    if (board[i + top][j + left] === 2) {
                        restEmptyLinesCount = i;
                        // end of the game
                        // stop adding figure
                        return false;   
                    }
                }
            }
        }   
           
        return true;
    }
    
    function fillRestSpace() {
        for (let i = 0; i < restEmptyLinesCount; i++) {
            for (let j = 0; j < figure[0].length; j++) {
                if (figure[i + restEmptyLinesCount][j] === 1) {
                    board[i][j + left] = 1;
                    visualBoard[i][j + left].style.backgroundColor = currentFigure.color;
                    visualBoard[i][j + left].classList.add("border-alpha");
                }
            }
        }
    }
}  

// next figure hint
function showUpcomingFigure(upcomingFigure, nextFigure) {
    upcomingFigureBoard.innerHTML = "";
    for (let i = 0; i < upcomingFigure.shape.length; i++) {
        let upcomingFigureBoardRow = document.createElement("div");
        upcomingFigureBoardRow.classList.add("upcoming-figures__board-row")
        upcomingFigureBoardRow.style.height = `calc(100% / ${upcomingFigure.shape.length})`;

        for (let j = 0; j < upcomingFigure.shape[0].length; j++) {
            let upcomingFigureBoardCell = document.createElement("div");            
            upcomingFigureBoardCell.classList.add("upcoming-figures__board-cell");
            
            if (upcomingFigure.shape[i][j] === 1) {
                upcomingFigureBoardCell.style.backgroundColor = upcomingFigure.color;
                upcomingFigureBoardCell.classList.add("border-alpha");
            } else {
                upcomingFigureBoardCell.style.backgroundColor = primaryColor;
                upcomingFigureBoardCell.classList.remove("border-alpha");

            }

            upcomingFigureBoardRow.append(upcomingFigureBoardCell);
        }

        upcomingFigureBoard.append(upcomingFigureBoardRow);
    }

    
}

function findCompletedRows(board, visualBoard, currentFigure) {
    
    // creating array with indexes of completed lines
    let completedRowsIdx = board.reduce((a,e,i) => {
        return e.every((el,j) => el === 2)  ? a = a.concat(i): a
    }, []);
    
    
    // if there is no completed rows 
    // continue game
    if (!completedRowsIdx.length) {
        return
    }


    // show completed lines count
    linesCount += completedRowsIdx.length;
    lines.innerText = linesCount;

    if (linesCount >= 10) {
        levelsCount++;
        linesCount = 0;
        level.innerText =  levelsCount;
        lines.innerText = "0";
        delay -= 100;
    }

    if (completedRowsIdx.length === 1) {
        scoreCount += levelsCount * 100;
        audioClearSingle.play();
    } else if (completedRowsIdx.length === 2) {
        scoreCount += levelsCount * 300;
        audioClearDouble.play();
    } else if (completedRowsIdx.length === 3) {
        scoreCount += levelsCount * 500;
        audioClearTriple.play(); 
    } else if (completedRowsIdx.length === 4) {
        scoreCount += levelsCount * 800;
        audioClearTriple.play();
    }

    score.innerText = scoreCount;

    // if there are cpmpleted lines remove them
    // move move all down
    moveRowsDown(completedRowsIdx);
    
    
    function moveRowsDown(rowsIndex) {
        for (let i = 0; i < rowsIndex.length; i++) {
            // starting from completed row
            for (let j = rowsIndex[i]; j > 0; j--) {
                for (let k = 0; k < board[0].length; k++) {
                    // copy upper line to lower line 
                    board[j][k] = board[j - 1][k];
                    // if upper line cell equals empty cell
                    if (board[j - 1][k] === 0) {
                        // fill lower cell with primary color
                        visualBoard[j][k].style.backgroundColor = primaryColor;
                        visualBoard[j][k].classList.remove("border-alpha"); 
                    } else if (board[j - 1][k] === 2) {
                        // take upper color from computed css styles
                        let upperBoardCellColor = window.getComputedStyle( visualBoard[j - 1][k] ,null).getPropertyValue('background-color');  
                        visualBoard[j][k].style.backgroundColor = upperBoardCellColor;
                        visualBoard[j][k].classList.add("border-alpha"); 
                    }
                    // fill upper line with primary color
                    visualBoard[j - 1][k].style.backgroundColor = primaryColor;                     
                    board[j - 1][k] = 0;

                }
            }
        }
    }
}

function moveFigureDown(board, visualBoard, currentFigure) {

    let figure = figureShape;
    let left = currentFigurePositions.left;
    let top = currentFigurePositions.top;
    let right = currentFigurePositions.right;
    let bottom = currentFigurePositions.bottom;

    // if bottom position higher than bottom edge
    // dont let it increase
    if (bottom >= board.length) {
        bottom = board.length - 1;
    }
    

    if (isBottomEdge()) {
        return null;
    }
    
    // taking positions and iterate from that positions
    // hint: for optimisation
    for (let i = bottom; i >= top; i--) {
        for (let j = left; j <= right; j++) {
            if (board[i][j] === 1) {
                board[i + 1][j] = board[i][j];
                board[i][j] = 0;
                visualBoard[i + 1][j].style.backgroundColor = currentFigure.color;
                visualBoard[i + 1][j].classList.add("border-alpha");
                visualBoard[i][j].style.backgroundColor = primaryColor;
                visualBoard[i][j].classList.remove("border-alpha");
                
            }
        }
    }

    
     
    // figured moved increasing position one step    
    currentFigurePositions.top++;
    currentFigurePositions.bottom++;

    // figure fall sound
    audioFigureFall.play();
   

    function isBottomEdge() {
        for (let i = 0; i < figure.length; i++) {
            for (let j = 0; j < figure[0].length; j++) {
                if (figure[i][j] === 1 && (i + top >= board.length - 1 || board[i +  top + 1][j + left] === 2)) {
                    // if figure touched bottom edge freeze it   
                    freezeFigure(board,visualBoard,currentFigure);
                   
                    return true;
                }
            }
        }

        return false;
    }

    function freezeFigure(board, visualBoard, currentFigure) {
        // freezed figure value is 2
        // to distinguish it from active figure
        for (let i = top; i <= bottom; i++) {
            for (let j = left; j <= right; j++) {
                if (board[i][j] === 1) {
                    board[i][j] = 2;
                    visualBoard[i][j].style.backgroundColor = currentFigure.color;
                    visualBoard[i][j].classList.add("border-alpha");    
                }
            }
        }
    }
}



function moveFigureLeft(board, visualBoard, currentFigure) {
    let figure = figureShape;
    let left = currentFigurePositions.left;
    let top = currentFigurePositions.top;
    let right = currentFigurePositions.right;
    let bottom = currentFigurePositions.bottom;
    

       
    
    if (isLeftEdge()) {
        audioFigureTouchLr.play();
        return
    }
    // dont allow left position go out of edge
    // that why i created top left bottom right vars
    //to not change currentFigurePositions
    // just dont iterate out of edge positions in loop
    if (left < 0) {
        left = 0;
    }
    // same as in upper comment
    if (bottom >= board.length) {
        bottom = board.length - 1;
    }

    audioFigureMoveLR.play();

    for (let i = left; i <= right; i++) {
        for (let j = top; j <= bottom; j++) {
            if (board[j][i] === 1) {
                board[j][i - 1] = 1;
                visualBoard[j][i - 1].style.backgroundColor = currentFigure.color;
                visualBoard[j][i - 1].classList.add("border-alpha");
                board[j][i] = 0;
                visualBoard[j][i].style.backgroundColor = primaryColor; 
                visualBoard[j][i].classList.remove("border-alpha");
  
            }
        }
    }

    // figure moved decrease position one step
    currentFigurePositions.left--;
    currentFigurePositions.right--;

    function isLeftEdge() {
        // iterating over figure
        for (let i = 0; i < figure[0].length; i++) {
            for (let j = 0; j < figure.length; j++) {
                // if we are on figure not on empty space than
                // check if its isnt out of edge or not on freezed figure
                if (figure[j][i] === 1 && (i + left - 1 < 0 || board[j + top][i + left - 1] === 2)) {
                    
                    return true;
                }
            }
        }
    
        return false;
    }
}

function moveFigureRight(board, visualBoard, currentFigure) {
    let figure = figureShape;
    let left = currentFigurePositions.left;
    let top = currentFigurePositions.top;
    let right = currentFigurePositions.right;
    let bottom = currentFigurePositions.bottom;

    if (isRightEdge()) {
        audioFigureTouchLr.play();
        return
    }

    // prevent right position decrease
    // to not get negative value in for loop
    if (right >= board[0].length) {
        right = board[0].length - 1;
    }

    if (bottom >= board.length) {
        bottom = board.length - 1;
    }

    // move figure right
    for (let i = right; i >= left; i--) {
        for (let j = top; j <= bottom; j++) {
            if (board[j][i] === 1) {
                board[j][i + 1] = 1;
                visualBoard[j][i + 1].style.backgroundColor = currentFigure.color;
                visualBoard[j][i + 1].classList.add("border-alpha");

                board[j][i] = 0;
                visualBoard[j][i].style.backgroundColor = primaryColor;
                visualBoard[j][i].classList.remove("border-alpha");
   
            }
        }
    }
    
    audioFigureMoveLR.play();

    // figure moved increase positions one step
    currentFigurePositions.left++;
    currentFigurePositions.right++;

    function isRightEdge() {
        
        for (let i = 0; i < figure[0].length; i++) {
            for (let j = 0; j < figure.length; j++) {
                if (figure[j][i] === 1 && (i + left + 1 >= board[0].length || board[j + top][i + left + 1] === 2)) {
                    return true;
                }
            }
        }
    
        return false;
    }
}
   
function rotateFigure(board, visualBoard, currentFigure) {
    let figure = figureShape;
    let left = currentFigurePositions.left;
    let top = currentFigurePositions.top;
    let right = currentFigurePositions.right;
    let bottom = currentFigurePositions.bottom;    
    
    let prevFigure = copyFigure(figureShape);

    let rotatedFigure = rotate();
    figureShape = rotatedFigure;
    if (isRotationPossible()) {
        addRotatedFigureToBoard();
        audioFigureRotate.play();
    } else {
        figureShape = prevFigure;
        audioFigureRotateFail.play();
        return;
    }
    // just start figure matrix from left bottom corner
    // and it will be rotated
    // in this way
    //             |  |  | 
    // -->[0,1,0]  [0,1,0]  
    // -->[1,1,1]  [0,1,1]
    // -->[0,0,0]  [0,1,0]

    function rotate() {
        let rotatedFigure = [];
           
        for (let i = 0; i < figure[0].length; i++) {
            rotatedFigure[i] = [];

            for (let j = figure.length - 1; j >= 0; j--) {
                rotatedFigure[i].push(figure[j][i]);
            }
        }

        return rotatedFigure;
    }

    // check if there are no freezed figure or its out of edge
    function isRotationPossible() {
        for (let i = 0; i < rotatedFigure.length; i++) {
            for (let j = 0; j < rotatedFigure[0].length; j++) {
                // check if figure isnt out of edge
                if (rotatedFigure[i][j] === 1 &&
                    (i + top >= board.length ||
                    j + left < 0 ||
                    j + left >= board[0].length)) {
                        return false;
                // check if there is no freezed figure       
                } else if (rotatedFigure[i][j] === 1 &&
                           board[i + top][j + left] === 2) {
                            return false;
                }              
            }
        }

        return true;
    }
    function addRotatedFigureToBoard() {
        
        for (let i = 0; i < rotatedFigure[0].length; i++) {
            for (let j = 0; j < rotatedFigure.length; j++) {
                // remove previous figure
                if (board[i + top][j + left] === 1) {
                    board[i + top][j + left] = 0;
                    visualBoard[i + top][j + left].style.backgroundColor = primaryColor;
                    visualBoard[i + top][j + left].classList.toggle("border-alpha");

                }

                // add rotated figure
                if (rotatedFigure[i][j] === 1) {
                    board[i + top][j + left] = 1;
                    visualBoard[i + top][j + left].style.backgroundColor = currentFigure.color;
                    visualBoard[i + top][j + left].classList.add("border-alpha");

                }
            }
        }    
    }
}

function copyFigure(figure) {
    return figure.map(row => row.map(cell => cell));
}

function addNewRecord() {
    
    winnerPlace = checkRecord();

    if (winnerPlace === -1) {
        return
    }

    // if is record
    newRecordBlock.classList.toggle("my-d-none");
    recordNameInput.addEventListener("keypress", onRecordNameEnter);
    

    function checkRecord() {
        // finding place of winner
        return recordsItems.findIndex(record => scoreCount > +record.lastElementChild.innerText);
    }

}

function onRecordNameEnter(event) {
    if (event.key === "Enter") {
        newRecordBlock.classList.toggle("my-d-none");
        addRecordToList(event.target.value);
    }
}

function addRecordToList(recordName) {
    let copy = [recordName,scoreCount];

    for (let i = winnerPlace; i < recordsItems.length - 1; i++) {
        copy.push(recordsItems[i].firstElementChild.innerText,recordsItems[i].lastElementChild.innerText);
    }

    for (let i = winnerPlace; i < recordsItems.length; i++) {
        recordsItems[i].firstElementChild.innerText = copy.shift();
        recordsItems[i].lastElementChild.innerText = copy.shift();

    }

    recordsItems[winnerPlace].classList.add("theme-red");

    // recordsItems[winnerPlace].lastElementChild.innerText = scoreCount;
    // recordsItems[winnerPlace].firstElementChild.innerText = recordName;
    winnerPlace = undefined;
}