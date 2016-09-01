
function getSpaceCoord(posX, posY) {

    var numRows = 6, numCols = 5;
    var row, col, startX, startY, endX, endY;
    var space = {'x': 0, 'y': 0};
    var canvas = document.querySelector("canvas");
    //var spaceHeight = Math.ceil(canvas.height/numRows);
    //var spaceWidth = Math.ceil(canvas.width/numCols);
    var spaceHeight = 60;
    var spaceWidth = 90;
    //var spaceHeight = gameBoard.height/6;
    //var spaceWidth = gameBoard.width/5;

    for (row = 0; row < numRows; row++) {
        for (col = 0; col < numCols; col++) {
            //startX = col*101;

            //startY = row * 83;
            startY = row * spaceHeight;
            startX = col * spaceWidth;
            endX = startX + spaceWidth;
            endY = startY + spaceHeight;
            if (posX >= startX && posX < endX && posY >= startY && posY < endY)  {
            //if (posX > endX && posY > endY) {
                space.x = col;
                space.y = row;
                return space;
            }
        }
    }

    return space;


}

