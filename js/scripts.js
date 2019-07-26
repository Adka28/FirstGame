$(document).ready(function() {
    var gameBoard = getBoard()
    var gameRunner = runner = { row: 0, col: 0 };
    var gameState = {
        gold: 0,
        lives: 1,
        finished: false 
    };

    drawBoard(gameBoard);
    showState(gameState);

    $("#appForm").submit(function(event) {
        var commands = $("#appForm input#commands").val();

        if (gameState.lives > 0) {
            interpretCommands(gameBoard, gameState, gameRunner, commands);

            event.preventDefault();
        }
        });
  });

function interpretCommands(board, state, runner, commands) {
    var n = board.length;
    for (var i = 0; i < commands.length; i++) {
        switch(commands[i]) {
            case 'u':
                moveRunner(board, state, runner, -1, 0);
                break;
            case 'd':
                moveRunner(board, state, runner, +1, 0);
                break;
            case 'r':
                moveRunner(board, state, runner, 0, +1);
                break;
            case 'l':
                moveRunner(board, state, runner, 0, -1);
                break;
            }

        drawBoard(board);
        showState(state);

        if (state.finished || state.lives == 0)
        {
            return;
        }
    }
}

function showState(state) {
    $("#stateGold").text(state.gold);
    $("#stateLives").text(state.lives);

    if (state.finished) {
        $("#stateFinished").show();
    }

    if (state.lives == 0) {
        $("#stateFailed").show();
    }
}

function moveRunner(board, state, runner, rowStep, colStep)
{
    var n = board.length;
    var newRow = runner.row + rowStep;
    var newCol = runner.col + colStep;

    if (newRow < 0 || newRow == n) {
        return;
    }

    if (newCol < 0 || newCol == n) {
        return;
    }

    var cellValue = getCellValue(board, newRow, newCol);
    
    if (cellValue == 'W') {
        return;
    }

    switch(cellValue) {
        case 'P':
            state.gold++;
            break;
        case 'L':
            state.lives++;
            break;
        case 'T':
            state.lives--;
            break;
        case 'X':
            if (Math.random() > 0.1) {
                state.gold *= 2;
            }
            else
            {
                state.gold = 0;
            }
            break;
        case 'E':
            state.finished = true;
            break;
    }

    setCellValue(board, runner.row, runner.col, '.');

    runner.row = newRow;
    runner.col = newCol;
    
    setCellValue(board, runner.row, runner.col, 'S');
}

function drawBoard(board) {
    var canvas = $('#gameCanvas');

    var n = board.length;
    var cellSize = canvas.width() / n;

    var ctx = canvas[0].getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width(), canvas.height());

    for (var row = 0; row < n; row++) {
        for (var col = 0; col < n; col++) {
            var cellValue = getCellValue(board, row, col);
            if (cellValue === 'W') {
                ctx.fillStyle="gray";
                ctx.fillRect(col*cellSize+1, row*cellSize+1, cellSize-2, cellSize-2);
            }
            else if (cellValue === '.') {
                ctx.fillStyle="gainsboro";
                ctx.fillRect(col*cellSize+1, row*cellSize+1, cellSize-2, cellSize-2);
            }
            else if (cellValue === 'P') {
                ctx.fillStyle="gold";
                ctx.fillRect(col*cellSize+1, row*cellSize+1, cellSize-2, cellSize-2);
            }
            else if (cellValue === 'L') {
                ctx.fillStyle="green";
                ctx.fillRect(col*cellSize+1, row*cellSize+1, cellSize-2, cellSize-2);
            }
            else if (cellValue === 'T') {
                ctx.fillStyle="brown";
                ctx.fillRect(col*cellSize+1, row*cellSize+1, cellSize-2, cellSize-2);
            }
            else if (cellValue === 'X') {
                ctx.fillStyle="pink";
                ctx.fillRect(col*cellSize+1, row*cellSize+1, cellSize-2, cellSize-2);
            }
            else if (cellValue === 'S') {
                ctx.fillStyle="blue";
                ctx.fillRect(col*cellSize+1, row*cellSize+1, cellSize-2, cellSize-2);
            }
            else if (cellValue === 'E') {
                ctx.fillStyle="red";
                ctx.fillRect(col*cellSize+1, row*cellSize+1, cellSize-2, cellSize-2);
            }
        }
    }
}

function getCellValue(board, row, col) {
    return board[row][col*2 + 1];
}

function setCellValue(board, row, col, value) {
    board[row] = board[row].replaceAt(col*2 + 1, value);
}

function getBoard() {
    var board = [
        " S . . . W . W W W W",
        " . W . . W W . L . W",
        " . W W W W . P W P W",
        " P . . W . . . . T W",
        " . W . . . W W . . .",
        " W . W W . P . W W .",
        " W . P . X W . L . .",
        " . . . W W W . . P W",
        " T . W W . P . W T .",
        " W . L . . W W W W E"
    ];

    return board;
}

String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}