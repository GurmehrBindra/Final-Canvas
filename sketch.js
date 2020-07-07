var canvas;
var database;
var drawing=[];
var currentPath=[];
var isDrawing= false;
var clearButton,saveButton;

function setup(){
    canvas = createCanvas(500,500);
    canvas.parent('canvascontainer');
    database = firebase.database();
    canvas.mousePressed(startPath);
    canvas.mouseReleased(endPath);
    saveButton= select('#SaveButton');
    saveButton.mousePressed(saveDrawing);
    clearButton= select('#ClearButton');
    clearButton.mousePressed(clearDrawing);
    
    var ref= database.ref("drawings");
    ref.on('value',gotData,errData);
}

function startPath(){
    currentPath=[];
    drawing.push(currentPath);
    isDrawing= true;
}

 function endPath(){
    isDrawing= false;
 }
function draw(){
background(0);

if(isDrawing){
    var point={
        x:mouseX,
        y:mouseY
    }
    currentPath.push(point);
}
console.log(drawing);
stroke(255);
strokeWeight(4);
noFill();
for(var i=0; i<drawing.length; i++){
    path= drawing[i];
    beginShape();
    for(var j =0; j< path.length; j++){
        vertex(path[j].x, path[j].y);
    }
    endShape();
}
}


function saveDrawing(){
var ref= database.ref('drawings');
var data={
    drawing:drawing
};
ref.push(data);
}

function gotData(data){
    var elts= selectAll(".listing");
    for(var i=0;i<elts.length;i++){
        var key= keys[i];
        var li= createElement("li","");
        li.class('listing');
        var ahref= createA("#",key);
        ahref.mousePressed(showDrawing);
        ahref.parent(li);

        var perma= createA("?id="+key, "permalink");
        perma.parent(li);
        perma.style('padding','4px');

        li.parent("drawinglist");
    }
}

function errData(err){
    console.log(err);
}

function showDrawing(){
    if(key instanceof MouseEvent){
        key= this.html();
    }

    var ref= database.ref("drawings/"+key);
    ref.once('value',oneDrawing,errData);
    
    function oneDrawing(){
        var dbdrawing = data.val();
        drawing= dbdrawing.drawing;
    }
}

function clearDrawing(){
    drawing=[]
}