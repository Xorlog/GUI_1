
// Function to validate input and call the table
// generaion function if it is all valid.
function createMult( ){

    
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
    
      if($("#multForm").valid() ) {
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

        // Add the table to our multContent placeholder.
        document.getElementById("multContent").innerHTML = newTable;
        return true;
    }
                

