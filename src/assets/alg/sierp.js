var points = [];  
var startingPoint;
var started = false;

function setup() {
    createCanvas(800, 600);
    strokeWeight(5);

    point(200, 300);
    point(600, 25);
    point(600, 575);
    points.push(new Point(200, 300));
    points.push(new Point(600, 25));
    points.push(new Point(600, 575));
    started = true;
}

function draw() {
    if(started) {
        rand = floor(random(3));
        let x = lerp(points[rand].getX(), startingPoint.x, 0.5);
        let y = lerp(points[rand].getY(), startingPoint.y, 0.5);
        point(x, y);    
        startingPoint = new Point(x, y);
    }
}


