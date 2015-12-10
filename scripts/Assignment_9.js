/*
        File: Assignment_9.js
        91.461 Assignment 9: Implementing a Bit of Scrabble with Drag-and-Drop
        Peter Maniatis Peter_Maniatis@Student.uml.edu
        Created 12/6/2015
*/
    // couple of globals
    roundScore = 0;
    totalScore = 0;
    var dict = {};


    function initBoardArray(){
        // Initialize board array to a single space.
        boardArray = Array.apply(null, Array(10)).map(String.prototype.valueOf,"");

    }



    // Add the tile to the board and handle score updates. 
    function addTile(event, ui){
        // Lock this board position down.  No stacking tiles!
        $(this).droppable('option', 'accept', ui.draggable);
 
        // Make sure the tile sits in the center
        ui.draggable.position(
        {
            my: "center",
            at: "center",
            of: $(this)
        });

        
        // Find out what type of piece was just placed here
        var piecePlaced = ui.draggable.attr('class').split(' ')[1].substr(6, 7);

        
        // What position on the board is this?
        var boardPosition = $(this).attr("id").substr(6, 7);


        // If the piece we just got came from a different position on the board, 
        // Need to update the board array and score.
        if(ui.draggable.data("position") != ""){
            // clear out that board spot
            boardArray[ui.draggable.data("position")] = "";
            
            // Was it PREVIOUSLY sitting on a double word score?
            if (ui.draggable.data("double") == true){
                console.log("Decrementing score by "+ScrabbleTiles[piecePlaced]["value"] * 2);
                roundScore -= ScrabbleTiles[piecePlaced]["value"] * 2;
            }else{
                console.log("Decrementing score by "+ScrabbleTiles[piecePlaced]["value"]);
                roundScore -= ScrabbleTiles[piecePlaced]["value"];
            }
        }
        
        // Set the piece position in case the user moves it.
        ui.draggable.data("position", String(boardPosition));
        
        console.log("Set position of this item to: " + String(boardPosition));
        
        var pieceScore;
        // If we are CURRENTLY on a double word score position, keep track
        // in case the user moves it
        if( boardPosition == 1 || boardPosition == 4 || boardPosition == 7){
            pieceScore =  ScrabbleTiles[piecePlaced]["value"] * 2;
            ui.draggable.data("double", true);
        }else{
            pieceScore =  ScrabbleTiles[piecePlaced]["value"];
            ui.draggable.data("double", false);
        }
        
        
        // Update the score!
        roundScore += pieceScore;
           
        console.log("Piece: " + piecePlaced + "\n" + "Placed at: " + boardPosition + "\n" +"Score: " + roundScore );
        
        // keep track of what is on the board.
        boardArray[boardPosition] = piecePlaced;
        
        console.log("Currently on board: "  + boardArray);
        updateWordandScore();
    }

    // update the score and word.
    function updateWordandScore(){
         // Update the score
        $('#roundScore').text("Round Score: " + roundScore);
         // Update the current word
        $('#word').text("Word: " + boardArray.join(""));
        
    }

    // remove the tile from this position
    function removeTile(event, ui){
        
        // open this pannel up again 
        $(this).droppable('option', 'accept', '.ui-draggable');
        
    }


    function resetBoard(keepScore){
        if (keepScore){
            totalScore += roundScore;
            $('#totalScore').text("Total Score: " + totalScore);
        }
        
        roundScore = 0;
        // reset the distributions 
        for ( var k = 0 ; k < Object.keys( ScrabbleTiles ).length + 1 ; k++ ) {
            // convert the integer loop index to an uppercase character, which the 
            //    subscript of the associative array of tile objects
            if ( k < Object.keys( ScrabbleTiles ).length - 1 ) {
              char = String.fromCharCode( 65 + k ) ;
            } else if ( k < Object.keys( ScrabbleTiles ).length ) {
              char = "_" ;
            } else{
              break;
            }
           ScrabbleTiles[char]["number-remaining"] = ScrabbleTiles[char]["original-distribution"];
       }
        
        // empty the player hand
        $( "#hand" ).empty();
        // reset the board array
        initBoardArray();
        // get a new hand
        getHand();
        updateWordandScore();
        
        //Board
        $(".board_slot").droppable({
            accept: ".ui-draggable"
        });
        
        
    }

    // reset the board, all scores and word
    function resetAll() {
        resetBoard(false);
        totalScore = 0;
        $('#totalScore').text("Total Score: " + totalScore);
    }

    // Keep global score but shuffle the letters in the players hand
    function shuffle(){
        resetBoard(false);
    }


    // The piece was taken off the board and placed in the tray
    function placedInTray(event, ui){
    
            console.log(ui.draggable.data("position"));
        
            // Find out what piece was removed
            var pieceRemoved = ui.draggable.attr('class').split(' ')[1].substr(6, 7);
            
            // find out where it was taken from
            var boardPosition = ui.draggable.data("position");
        
            // check if that position is a double word score and update accordingly.
            if (ui.draggable.data("double") == true){
                roundScore -= ScrabbleTiles[pieceRemoved]["value"] * 2;
            }else{
                roundScore -= ScrabbleTiles[pieceRemoved]["value"];
            }
        
            // fix the board array
            boardArray[boardPosition] = "";
            // fix the UI element previous position because now it is in the tray
            ui.draggable.data("position", "");
        
            console.log("Currently on board: "  + boardArray);
        
            console.log("Piece: " + pieceRemoved + "\n" + "Placed at: " + boardPosition + "\n" +"Score: " + roundScore );
            // update output
            updateWordandScore();
        
    }



    // This function populates the players hand.  The interesting piece to this function is that it 
    // does NOT generate a purely random set of tokens, but a TRUE weighted probabilistic distribution 
    // of tiles over the ones remaining.
    function getHand(){
        var totalRemaining = 0; 
        var trueDistribution = [];
        var nextToken;
        var playerHand = [];
        
        // Taken from sample code given by Jesse.  Modified to build a TRUE probabilistic distribution
        // of tokens.  
        for ( var k = 0 ; k < Object.keys( ScrabbleTiles ).length + 1 ; k++ ) {
            // convert the integer loop index to an uppercase character, which the 
            //    subscript of the associative array of tile objects
            if ( k < Object.keys( ScrabbleTiles ).length - 1 ) {
              char = String.fromCharCode( 65 + k ) ;
            } else if ( k < Object.keys( ScrabbleTiles ).length ) {
              char = "_" ;
            } else{
              break;
            }
            
            // Build an array (bag of tiles) out of the remaining tiles
            for (var x = 0 ; x < ScrabbleTiles[char]["number-remaining"] ; x++){
                trueDistribution.push(char);
            }
        }
        
                
        
        // Grab 7 tiles
        for (var y = 0; y < 7; y++){
            // pick a random tile out of our "bag of tiles"
            nextToken = Math.floor(Math.random() * trueDistribution.length) 
            
            //Add it to the players hand display
            $("#hand").append("<img class='piece piece_"+ trueDistribution[nextToken] +"' src='img/Scrabble_Tiles/Scrabble_Tile_" + trueDistribution[nextToken] + ".jpg' />");
            
            playerHand.push(trueDistribution[nextToken]);
            
            
            // now Decrement the remaining tiles by 1
            ScrabbleTiles[trueDistribution[nextToken]]["number-remaining"] -= 1;
            
            
            // and remove it from our bag.
            trueDistribution.splice(nextToken, 1);
        }
        
        //Pieces
        $( ".piece" ).draggable({ 
            revert: "invalid"
        }).data("position", "");

    }


    // Submit the word and check if it is in the dictionary.
    // Validation based on Jason Downing piazza post
    function submitWord(){
        console.log("inside submitWord");
        // See if it's in the dictionary
        for(var x = 0; x < boardArray.length; x++){
            if (boardArray[x] == ""){
                continue;
            }else{
                
            }
        }
        
        word = boardArray.join("").toLowerCase();
        
        console.log(word);
        if ( dict[ word ] ) {
            // If it is, return that word
            console.log("True");
            resetBoard(true);
            alert("Word Accepted!");
            return;
        }
        
        alert("Unknown word");
        console.log("False");

    }


    // initial setup.
    $(document).ready(function(){
        
        // get a new hand
        getHand();
        // init the board array
        initBoardArray();

        
        // make the board and hand droppable 
        $(".board_slot").droppable({
            drop: addTile, 
            out: removeTile
        });
        //Hand
        $("#hand").droppable({
                drop: placedInTray
        });
        
        
        // Do a jQuery Ajax request for the text dictionary
        $.get( "dictionary.txt", function( txt ) {
        // Get an array of all the words
        var words = txt.split( "\n" );
 
        // And add them as properties to the dictionary lookup
        // This will allow for fast lookups later
        for ( var i = 0; i < words.length; i++ ) {
            dict[ words[i] ] = true;
        }
            
            
});
    
    });
                


// From Jesse
var ScrabbleTiles = [] ;
ScrabbleTiles["A"] = { "value" : 1,  "original-distribution" : 9,  "number-remaining" : 9  } ;
ScrabbleTiles["B"] = { "value" : 3,  "original-distribution" : 2,  "number-remaining" : 2  } ;
ScrabbleTiles["C"] = { "value" : 3,  "original-distribution" : 2,  "number-remaining" : 2  } ;
ScrabbleTiles["D"] = { "value" : 2,  "original-distribution" : 4,  "number-remaining" : 4  } ;
ScrabbleTiles["E"] = { "value" : 1,  "original-distribution" : 12, "number-remaining" : 12 } ;
ScrabbleTiles["F"] = { "value" : 4,  "original-distribution" : 2,  "number-remaining" : 2  } ;
ScrabbleTiles["G"] = { "value" : 2,  "original-distribution" : 3,  "number-remaining" : 3  } ;
ScrabbleTiles["H"] = { "value" : 4,  "original-distribution" : 2,  "number-remaining" : 2  } ;
ScrabbleTiles["I"] = { "value" : 1,  "original-distribution" : 9,  "number-remaining" : 9  } ;
ScrabbleTiles["J"] = { "value" : 8,  "original-distribution" : 1,  "number-remaining" : 1  } ;
ScrabbleTiles["K"] = { "value" : 5,  "original-distribution" : 1,  "number-remaining" : 1  } ;
ScrabbleTiles["L"] = { "value" : 1,  "original-distribution" : 4,  "number-remaining" : 4  } ;
ScrabbleTiles["M"] = { "value" : 3,  "original-distribution" : 2,  "number-remaining" : 2  } ;
ScrabbleTiles["N"] = { "value" : 1,  "original-distribution" : 6,  "number-remaining" : 6  } ;
ScrabbleTiles["O"] = { "value" : 1,  "original-distribution" : 8,  "number-remaining" : 8  } ;
ScrabbleTiles["P"] = { "value" : 3,  "original-distribution" : 2,  "number-remaining" : 2  } ;
ScrabbleTiles["Q"] = { "value" : 10, "original-distribution" : 1,  "number-remaining" : 1  } ;
ScrabbleTiles["R"] = { "value" : 1,  "original-distribution" : 6,  "number-remaining" : 6  } ;
ScrabbleTiles["S"] = { "value" : 1,  "original-distribution" : 4,  "number-remaining" : 4  } ;
ScrabbleTiles["T"] = { "value" : 1,  "original-distribution" : 6,  "number-remaining" : 6  } ;
ScrabbleTiles["U"] = { "value" : 1,  "original-distribution" : 4,  "number-remaining" : 4  } ;
ScrabbleTiles["V"] = { "value" : 4,  "original-distribution" : 2,  "number-remaining" : 2  } ;
ScrabbleTiles["W"] = { "value" : 4,  "original-distribution" : 2,  "number-remaining" : 2  } ;
ScrabbleTiles["X"] = { "value" : 8,  "original-distribution" : 1,  "number-remaining" : 1  } ;
ScrabbleTiles["Y"] = { "value" : 4,  "original-distribution" : 2,  "number-remaining" : 2  } ;
ScrabbleTiles["Z"] = { "value" : 10, "original-distribution" : 1,  "number-remaining" : 1  } ;
ScrabbleTiles["_"] = { "value" : 0,  "original-distribution" : 2,  "number-remaining" : 2  } ;


