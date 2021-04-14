var Point = Isomer.Point;
var Path = Isomer.Path;
var Shape = Isomer.Shape;
var Color = Isomer.Color;

var canvas = document.getElementById("isomer-canvas");
var iso = new Isomer(canvas);
var ctx = canvas.getContext('2d');

var gap = 0.2;

function Roof(origin) {
  var faces = [];

  const face = new Path([
    origin.translate(0, 0, 0),
    origin.translate(0, 2, 0),
    origin.translate(1, 1, 3)
  ]);

  for (let i = 0; i < 4; i++) {
    faces.push(face.rotateZ(Point(1, 1, 1.5), i * Math.PI / 2));
  }

  return new Shape(faces);
}

function ClockFace() {
  const sides = 24;

  const points = [];

  for (let i = 0; i < sides; i++) {
    let angle = 2 * Math.PI * i / sides + Math.PI / 4;
    let x = Math.cos(angle) / 2;
    let z = Math.sin(angle) / 2;
    points.push(Point(x, 0, z));
  }

  return new Path(points);
}

function drawTower(angle) {
  let theme = themes[themeName];

  const towerHeight = 13;
  const roofHeight = 2;

  // grass
  iso.add(new Path([
    Point(-1, -1, 0),
    Point(-1, 15, 0),
    Point(15, 15, 0),
    Point(15, -1, 0)
  ]), theme.grass);

  // uris back building lower part
  iso.add(Shape.Prism(Point(7 + 3 * gap, 11 + gap, 0), 4, 4 - gap, 2), theme.gray);

  // uris back building
  iso.add(Shape.Prism(Point(7 + 3 * gap, 7 + gap, 0), 4, 4 - gap, 3), theme.gray);

  // uris back building entryway
  iso.add(Shape.Prism(Point(7 + 3 * gap, 5 + gap, 0), 3, 2 - gap, 2), theme.gray);
  iso.add(Shape.Prism(Point(7 + 3 * gap, 0, 0), 1, 3 - gap, 2), theme.gray);

  // long uris building
  iso.add(Shape.Prism(Point(4 + 2 * gap, 0, 0), 3, 15, 3), theme.gray);

  // uris triangular roof front
  iso.add(Shape.Pyramid(Point(3 + 2 * gap, -1, 4 + gap), 3, 4, roofHeight), theme.red);

  // uris long roof
  iso.add(new Path([
    Point(4 + 3 * gap, gap, 3),
    Point(4 + 3 * gap + 1.5, 2 + gap, 3 + roofHeight),
    Point(4 + 3 * gap + 1.5, 15 + gap, 3 + roofHeight),
    Point(4 + 3 * gap, 15 + gap, 3),
  ]), theme.red);

  // left side building
  iso.add(Shape.Prism(Point(0, 11 + gap, 0), 4 + 2 * gap, 4 - gap, 3), theme.gray);

  // middle side building
  iso.add(Shape.Prism(Point(0, 7 + gap, 0), 4 + 2 * gap, 4 - gap, 3), theme.gray);

  // middle side roof triangle
  iso.add(Shape.Pyramid(Point(0, 7 + gap, 3 + gap), 3, 4 - gap, roofHeight - 0.5), theme.red);

  // middle side roof long front
  iso.add(new Path([
    Point(1.5, 9 + gap / 2, 3 + gap + roofHeight - 0.5),
    Point(0, 7 + gap, 3 + gap),
    Point(4 + gap, 7 + gap, 3 + gap),
    Point(4 + gap + 1.5, 9 + gap / 2, 3 + gap + roofHeight - 0.5),
  ]), theme.red);

  // middle side roof long back
  iso.add(new Path([
    Point(1.5, 9 + gap / 2, 3 + gap + roofHeight - 0.5),
    Point(0, 11, 3 + gap),
    Point(4 + gap, 11, 3 + gap),
    Point(4 + gap + 1.5, 9 + gap / 2, 3 + gap + roofHeight - 0.5),
  ]), theme.red);

  // small entry building behind tower
  iso.add(Shape.Prism(Point(2 + gap, 0, 0), 2, 7, 2), theme.gray);

  // clock tower base
  iso.add(Shape.Prism(Point.ORIGIN, 2, 2, towerHeight), theme.gray);

  // clock tower roof
  iso.add(Roof(Point(0, 0, towerHeight + gap + bounce))
    .rotateZ(Point(1, 1, 0), angle), theme.red)

  // clock faces
  const clockFaceHeight = towerHeight - 2.5;
  iso.add(ClockFace().translate(1, 0, clockFaceHeight), theme.clock);
  iso.add(ClockFace()
    .rotateZ(Point(0, 0, 0), -Math.PI / 2)
    .translate(0, 1, clockFaceHeight),
    theme.clock);
}

let updateAngle = false;
let angle = 0;
let v = 0.6;
let a = 0.05;
let t = 0;
let bounce = 0;

function pos(t) {
  return Math.max(0, t * v - a * t * t / 2);
}

function draw() {
  requestAnimationFrame(draw);
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  drawTower(angle);
  if (updateAngle) {
    angle += Math.PI / 60;
    bounce = pos(t);
    t += 1;
  }
}

requestAnimationFrame(draw);
setInterval(() => {
  updateAngle = true;
  setTimeout(() => {
    updateAngle = false;
    angle = 0;
    bounce = 0;
    t = 0;
  }, 500)
}, 2000);