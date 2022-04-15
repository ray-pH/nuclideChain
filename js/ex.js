var canvas = document.getElementById("canvas"),
  ctx = canvas.getContext("2d");

canvas.width = canvas.height = 500;

var targetX = 0,
  targetY = 0,
  x = 10,
  y = 10,
  velX = 0,
  velY = 0,
  speed = 5;

function update() {
  var tx = targetX - x,
    ty = targetY - y,
    dist = Math.sqrt(tx * tx + ty * ty),
    rad = Math.atan2(ty, tx),
    angle = rad / Math.PI * 180;

  velX = (tx / dist) * speed,
    velY = (ty / dist) * speed;

  x += velX
  y += velY

  ctx.clearRect(0, 0, 500, 500);
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, Math.PI * 2);
  ctx.fill();

  setTimeout(update, 10);
}

update();

canvas.addEventListener("mousemove", function(e) {
  targetX = e.pageX;
  targetY = e.pageY;
});
