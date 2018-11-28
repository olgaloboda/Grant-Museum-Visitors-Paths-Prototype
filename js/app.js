function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

$(document).ready(function(){

    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext('2d');

    function addImage() {
        var image = new Image();
        image.src = "./images/GMZ_ground_floor_plan_with_case_numbers_exits.png";
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    }
    addImage();

    var stops = {};
    var visitors = {};
    var visitorNumber = 1;
    var stopNumber = 0;
    var startTime;
    var visit = false;
    var show = false;

    // end the visit 
    $("#end").click(function (){
        var date = new Date();

        // save the time when the visit ended
        visitors[visitorNumber]["endVisit"] = date.getTime();

        // calculate the overall visit
        visitors[visitorNumber]["overallVisit"] = visitors[visitorNumber]["endVisit"] - visitors[visitorNumber]["startVisit"];

        // convert values from the json object to a human-readable format
        var savedVisit = new Date(visitors[visitorNumber].endVisit);
        var overallVisit = new Date(visitors[visitorNumber]["overallVisit"]);

        //add data to the visitor block
        $("#visitor" + visitorNumber).append("</table><div class='footer text-right'><span>Visit ended at: " + savedVisit.getHours() + ":" + savedVisit.getMinutes()  + ":" + savedVisit.getSeconds() + "</span><br><span>Time spent in the museum in mins: " + overallVisit.getMinutes() + ":" + overallVisit.getSeconds() + "</span></div></div><br>");
        stops = {};
        visitorNumber += 1;
        stopNumber = 0;
        visit = false;
    });


    // clear the canvas
    $("#clear").click(function(){
        if (visit == true) {
            $("#end").click();
        }
        ctx.clearRect(0, 0, document.getElementById("myCanvas").width, document.getElementById("myCanvas").height);
        addImage();
        show = true;
    });

    // log the end time of a stop
    $("#stop").click(function() {
        var date = new Date();
        var endTime = date.getTime();
        var timeSpent = Math.abs(endTime - startTime) / 1000;
        stops[stopNumber]["endTime"] = endTime;
        stops[stopNumber]["timeSpent"] = timeSpent;
    });

    // save the json object to a file
    $("#save").click(function() {
        var file = new File([JSON.stringify(visitors)], {type: "text/plain;charset='utf-8'"});
        saveAs(file, "visitorlogs.json");
    });

    // show all paths on a canvas
    $("#showAll").click(function() {
        if (show == true) {
            for (var n in visitors) {
                for (var s in visitors[n]["stops"]) {
                    ctx.beginPath();
                    ctx.arc(visitors[n]["stops"][s]["x"],visitors[n]["stops"][s]["y"],5,0,2*Math.PI);
                    ctx.closePath();
                    if (s == 1) {
                        ctx.fillStyle="red";
                    } else {
                        ctx.fillStyle="orange";
                    }
                    ctx.fill();
                    if (s != 1) {
                        ctx.beginPath();
                        ctx.moveTo(visitors[n]["stops"][s-1]["x"],visitors[n]["stops"][s-1]["y"]);
                        ctx.lineTo(visitors[n]["stops"][s]["x"],visitors[n]["stops"][s]["y"]);
                        ctx.stroke();
                        ctx.strokeStyle=visitors[n]["colour"];
                        ctx.lineWidth=3;
                        ctx.closePath();
                    }
                }
            }
            show = false;
        } else {
            alert('Please clear the canvas first');
        }
    });


    // start the visit or log the stop when clicked on the canvas
    $("canvas").click(function(event){
        
        if ((stopNumber >= 1) && !(stops[stopNumber].hasOwnProperty("endTime"))) {
            $("#stop").click();

        }

        var date = new Date();
        startTime = date.getTime();
        stopNumber += 1;

        if (stopNumber == 1) {
            visit = true;
            visitors[visitorNumber] = {"startVisit" : date.getTime(), "colour": getRandomColor()};

            var savedVisit = new Date(visitors[visitorNumber].startVisit);

            $("#description").append("<div id='visitor"+ visitorNumber + "'></div>");
            $("#visitor"+visitorNumber).append("<div class='header d-flex'><span style='color: " 
                + visitors[visitorNumber]["colour"] + "''>" + "Visitor: " + visitorNumber + "</span><a href='#' id='remove" + visitorNumber + "' class='remove'>Remove</a><span class='ml-auto'>" + "Visit started at: " + savedVisit.getHours() + ":" + savedVisit.getMinutes()  + ":" + savedVisit.getSeconds() + "</span></div><table>");
        }

        var mouseX = event.clientX - ctx.canvas.offsetLeft;
        var mouseY = event.clientY - ctx.canvas.offsetTop;
        ctx.beginPath();
        ctx.arc(mouseX,mouseY,5,0,2*Math.PI);
        ctx.closePath();
        if (stopNumber == 1) {
            ctx.fillStyle="red";
        } else {
            ctx.fillStyle="orange";
        }
        ctx.fill();

        stops[stopNumber] = {
            x: mouseX,
            y: mouseY,
            startTime: startTime
        }

        if (stopNumber > 1) {
            ctx.beginPath();
            ctx.moveTo(stops[stopNumber-1].x,stops[stopNumber-1].y);
            ctx.lineTo(stops[stopNumber].x,stops[stopNumber].y);
            ctx.stroke();
            ctx.strokeStyle=visitors[visitorNumber]["colour"];
            ctx.lineWidth=3;
            ctx.closePath();
        }

        
        visitors[visitorNumber]["stops"] = stops;
        
        // console.log("Stops ", stops);
        console.log("Visitors ", visitors);
        var savedDate = new Date(stops[stopNumber].startTime);
        $("#visitor"+visitorNumber + " > table").append("<tr><td class='first'>" + stopNumber + "</td><td>" + mouseX + ", " + mouseY + "</td><td>" + savedDate.getHours() + ":" + savedDate.getMinutes() + ":" + savedDate.getSeconds() + "</td></tr>");
        var messageBody = document.querySelector('#description');
        messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;


        $(".remove").on("click", function(event) {
            event.preventDefault();
            $("#clear").click();
            var str = event.target.id;
            var id = str.split('remove').pop();
            delete visitors[id];
            $(this).parent().parent().remove();
        });
    });
});