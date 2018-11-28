## Brief description
This desktop prototype was created to conduct observational studies at the UCL Grant Museum of Zoology. It allows tracking visitors' paths, number of stops, and logging time spent in the museum, next to the objects and walking time.

## Functionality
The user can log data of several visitors (one at a time) by marking their path on the canvas. 
In the window on the right, the system displays the visitor number, number of visitors' stops, (x,y) coordinates on the canvas, and the start time of browsing a certain cabinet. The system also logs the end time as a part of each json object, yet this information is not displayed in the table.
In case several visitors are tracked on one canvas, the paths are marked with different colours that correspond to the colour of "Visitor #" in the window on the right. The user can also clear the canvas and retrieve data by clicking "Show all" as well as remove logged data by clicking "Remove" next to "Visitor #".
By clicking "Save data", the prototype generates the .json document with 
- the number of stops, (x,y) coordinates on the canvas, 
- time spent next to the objects including start time, end time, 
- overall time spent in the museum, 
- the unique colour of each visitor's path.
Time is logged in milliseconds since Jan 1, 1970, 00:00:00.000 GMT to also retrieve the date of the experiment if needed.

## Ethics
This prototype does not collect any data that can threaten the anonymity of visitors.

![Screenshot](https://github.com/olgaloboda/Grant-Museum-Visitors-Paths-Prototype/blob/master/Prototype.png)

## Available at https://olgaloboda.github.io/Grant-Museum-Visitors-Paths-Prototype/.
