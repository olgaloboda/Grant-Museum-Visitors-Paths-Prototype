$(document).ready(function(){
    var ctx = document.getElementById("myCanvas").getContext('2d');
    var stops = {};
    var visitors = {};
    var visitorNumber = 0;
    var stopNumber = 0;
    var startTime;

    $("#clear").click(function(){
        var date = new Date();
        visitors[visitorNumber]["endVisit"] = date.getTime();
        visitors[visitorNumber]["overallVisit"] = Math.abs(visitors[visitorNumber]["endVisit"] - visitors[visitorNumber]["startVisit"]) / 1000;
        stops = {};
        visitorNumber += 1;
        stopNumber = 0;
        ctx.clearRect(0, 0, document.getElementById("myCanvas").width, document.getElementById("myCanvas").height);
    });

    $("#end").click(function(){
        var date = new Date();
        visitors[visitorNumber]["endVisit"] = date.getTime();
        visitors[visitorNumber]["overallVisit"] = Math.abs(visitors[visitorNumber]["endVisit"] - visitors[visitorNumber]["startVisit"]) / 1000;
        var savedVisit = new Date(visitors[visitorNumber].endVisit);
        $("#description").append("</table>" + "Visit ended at: " + savedVisit.getHours() + ":" + savedVisit.getMinutes()  + ":" + savedVisit.getSeconds() + "<br>" + "Overall visit in minutes:" + (visitors[visitorNumber]["overallVisit"] / 60).toFixed(2) + "</div><br>");
        stops = {};
        visitorNumber += 1;
        stopNumber = 0;
    });

    $("canvas").click(function(event){
        if (stopNumber >= 1) {
            var date = new Date();
            var endTime = date.getTime();
            var timeSpent = Math.abs(endTime - startTime) / 1000;
            stops[stopNumber]["endTime"] = endTime;
            stops[stopNumber]["timeSpent"] = timeSpent;
        }
        var date = new Date();
        startTime = date.getTime();
        stopNumber += 1;

        var mouseX = event.clientX - ctx.canvas.offsetLeft;
        var mouseY = event.clientY - ctx.canvas.offsetTop;
        ctx.beginPath();
        ctx.arc(mouseX,mouseY,5,0,2*Math.PI);
        ctx.closePath();
        if (stopNumber == 1) {
            ctx.fillStyle="orange";
        } else {
            ctx.fillStyle="black";
        }
        ctx.fill();

        stops[stopNumber] = {
            x: mouseX,
            y: mouseY,
            startTime: startTime
        }

        if (stopNumber != 1) {
            ctx.beginPath();
            ctx.moveTo(stops[stopNumber-1].x,stops[stopNumber-1].y);
            ctx.lineTo(stops[stopNumber].x,stops[stopNumber].y);
            ctx.stroke();
            ctx.closePath();
        }

        if (visitorNumber == 0) {
            visitorNumber += 1;
        }

        if (stopNumber == 1) {
            visitors[visitorNumber] = {"startVisit" : date.getTime()};
            var savedVisit = new Date(visitors[visitorNumber].startVisit);
            $("#description").append("<div class='margin-top'>" + "Visitor: " + visitorNumber + "<br>" + "Visit started at: " + savedVisit.getHours() + ":" + savedVisit.getMinutes()  + ":" + savedVisit.getSeconds() + "<table>");
        }
        
        visitors[visitorNumber]["stops"] = {stops};
        
        // console.log("Stops ", stops);
        // console.log("Visitors ", visitors);
        var savedDate = new Date(stops[stopNumber].startTime)
        $("#description").append("<tr><td class='first'>Stop: " + stopNumber + "</td><td>" + mouseX + " | " + mouseY + "</td><td>StartTime: " + savedDate.getHours() + ":" + savedDate.getMinutes() + ":" + savedDate.getSeconds() + "</td></tr>");
    });
});