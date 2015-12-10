/*
        File: Assignment_8.js
        91.461 Assignment No. 7 Using the jQuery UI Slider and Tab Widgets
        Peter Maniatis Peter_Maniatis@Student.uml.edu
        Created 11/17/15
*/

numTabs = 0;

$('document').ready(function(){
    
    
    // Initialize tabs
    $(function () {
        $("#tabs").tabs();
    }); 
    // Allow tabs to be closable
    $('#tabs').tabs({closable: true})
    
    // Bind a close event to the close button
    $('#closeButton').click(function(){
        console.log("Inside click");
        var Index = $("#tabs").tabs('option', 'active');
        console.log(Index);
        var tab = $( "#tabs" ).find( ".ui-tabs-nav li:eq(" +Index+ ")" ).remove();
        $('#multContent' +Index ).remove();
        $('#multTab_' +Index ).remove();
        
        $( "tabs" ).tabs( "refresh" );
    });
    
    
    
    //Add the slider place holders
    $( '#num1StartDiv' ).append('<div id="num1StartSlider"></div>');
    $( '#num2StartDiv' ).append('<div id="num2StartSlider"></div>');
    $( '#num1EndDiv' ).append('<div id="num1EndSlider"></div>');
    $( '#num2EndDiv' ).append('<div id="num2EndSlider"></div>');
    
    
    
    // Min & max values for all sliders
    // Also, set the slide: event to trigger a
    // callback that will change the value of the 
    // form, AND revalidate the input.
    // first one explicitely commented, others are the same format.
    $(function() {
        $( "#num1StartSlider" ).slider({
        min: -15, // minimum value
        max: 15, // maximum value
        value: 0, // default value
        slide: function( event, ui ) { // on slide event
            $( "#num1Start" ).val(ui.value);// change the input box value to match the slider position
            createMult(); // update table dynamically
        }
        });
    });
    
    $(function() {
        $( "#num2StartSlider" ).slider({
        min: -15,
        max: 15,
        value: 0,
        slide: function( event, ui ) {
            $( "#num2Start" ).val(ui.value);
            createMult();
        }
        });
        
    });
    
    $(function() {
        $( "#num1EndSlider" ).slider({
        min: -15,
        max: 15,
        value: 0,
        slide: function( event, ui ) {
            $( "#num1End" ).val(ui.value);
            createMult();
        }
        });
        
    });
    
    $(function() {
        $( "#num2EndSlider" ).slider({
        min: -15,
        max: 15,
        value: 0,
        slide: function( event, ui ) {
            $( "#num2End" ).val(ui.value);
            createMult();
        }
        });
    });/*End slider config*/
    
    
    
    
    // Make sure when we change the input box values, we also move the slider.
    $( "#num1Start" ).change(function() {
      $( "#num1StartSlider" ).slider( "value", $( "#num1Start" ).val() );
        createMult();
    });
    
    $( "#num2Start" ).change(function() {
      $( "#num2StartSlider" ).slider( "value", $( "#num2Start" ).val() );
        createMult();
    });
    
    $( "#num1End" ).change(function() {
      $( "#num1EndSlider" ).slider( "value", $( "#num1End" ).val() );
        createMult();
    });
    
    $( "#num2End" ).change(function() {
      $( "#num2EndSlider" ).slider( "value", $( "#num2End" ).val() );
        createMult();
    });
    
    
    
}); // End of $('document').ready




// Function to validate input and call the table
// generaion function if it is all valid.
function createMult(){
   
    
    // Make sure we have numbers and they are within the range -15 to 15
    $( '#multForm' ).validate( {
        rules: {
            num1Start :{
                required:true,
                number:true,
                range: [-15, 15]
            },
            num1End: {
                required:true,
                number:true,
                range: [-15, 15]
            },
            num2Start :{
                required:true,
                number:true,
                range: [-15, 15]
            },
            num2End: {
                required:true,
                number:true,
                range: [-15, 15]
            }
        },
        // Change default error messages.
        messages :{
            num1Start :{
                required : "*",
                number: "Please enter numbers only"
            },
            num1End: {
                required : "*",
                number: "Please enter numbers only"
            },
            num2Start :{
                required : "*",
                number: "Please enter numbers only"
            },
            num2End: {
                required : "*",
                number: "Please enter numbers only"
            }
        }// end messages
    } ) ; // end validate()
    
    
      if( $("#multForm").valid() ) {
            generateTable();
      }
    
}

// Function that actually generates the multiplication table

 function generateTable(){
        
     
         // get all of our start and end numbers.
        num1Start = parseInt(document.getElementById("num1Start").value);
        num1End = parseInt(document.getElementById("num1End").value);
        num2Start = parseInt(document.getElementById("num2Start").value);
        num2End = parseInt(document.getElementById("num2End").value);
        
        var tmpMessage = "";
        // flip numbers if start is less than end
        if(num1End < num1Start){
            var tmp = num1End;
            num1End = num1Start;
            num1Start= tmp;
            tmpMessage = "Swapping Multiplier Start and Multiplier End <br>";
        }
                
        if(num2End < num2Start){
            var tmp = num2End;
            num2End = num2Start;
            num2Start= tmp;
            tmpMessage += "Swapping Multiplicand Start and Multiplicand End ";
        }
        
        // Let the user know we are flipping their numbers
        document.getElementById("Instructions1").innerHTML = tmpMessage;
        tmpMessage = "";
     
        // variable that will hold our new content.
        var newTable = "<table>";

        // Create the top row
        newTable += "<tr> <td> &nbsp; </td>";
        for(var topRow = num1Start; topRow <= num1End; topRow++){
            newTable += "<td>" + topRow + "</td>";
        }
        newTable += "</tr>";


        // Create the rest of the table
        for(var rows = num2Start; rows <= num2End; rows++){
            newTable += "<tr>";
            for(var cols = num1Start; cols <= num1End; cols++){
                if(cols == num1Start){
                    newTable += "<td>" + rows + "</td>";
                }
                    newTable += "<td>" + cols * rows + "</td>";
            }
            newTable += "</tr>";
        }
        newTable += "</table>"


        // Add the table to our multContent placeholder.
        document.getElementById("multContent").innerHTML = newTable;
        
     
        return true;
    }
                

// Ad our dynamic table to the tabs
function addTab(){

        // Destroy the existing tabs
        $("#tabs").tabs("destroy"); 
     
        // Create a new list item for our tab
        $('#tabs ul').append('<li class="tab id="multTab"_' + numTabs + '"><a href="#multContent' + numTabs + '">Tab '+(numTabs+1)+'</a></li>');
        
        // Fill the div with the table contents
        $('#tabs').append('<li id="multContent'+ numTabs +'"> '+ $('#multContent').html() +'</li>')
        
        // Make this one active
        $("#tabs").tabs({ active: (numTabs) }); 
        //$('#multContent').empty();
        
        numTabs ++;

}

