//https://www.apple.com/105/media/us/airpods-pro/2019/1299e2f5_9206_4470_b28e_08307a42f19b/anim/sequence/large/01-hero-lightpass/0001.jpg

function pageExample02() {
  const html = document.documentElement;
  const canvas = document.querySelector('canvas');
  const context = canvas.getContext('2d');

  canvas.width = 720;
  canvas.height = 720;

  function drawHouse() {
    // lineWidth
    context.lineWidth = 10;

    // Wall
    context.strokeStyle = 'brown';
    context.strokeRect(75, 140, 150, 110);

    //Door
    context.fillRect(130, 190, 40, 60);

    //Roof
    context.strokeStyle = 'red';
    context.beginPath();
    context.moveTo(50, 140);
    context.lineTo(150, 60);
    context.lineTo(250, 140);
    context.closePath();
    context.stroke();

    //Chimeny
    context.strokeStyle = 'gray';
    context.beginPath();
    context.moveTo(200, 100);
    context.lineTo(200, 60);
    context.lineTo(220, 60);
    context.lineTo(220, 115);

    context.closePath();
    context.stroke();
  }

  // drawHouse();
}

document.addEventListener('DOMContentLoaded', () => {
  pageExample02();
});
