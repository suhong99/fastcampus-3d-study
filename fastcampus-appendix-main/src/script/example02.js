//https://www.apple.com/105/media/us/airpods-pro/2019/1299e2f5_9206_4470_b28e_08307a42f19b/anim/sequence/large/01-hero-lightpass/0001.jpg

function pageExample02() {
  const html = document.documentElement;
  const canvas = document.querySelector('canvas');
  const context = canvas.getContext('2d');

  function drawHouse() {
    canvas.width = 720;
    canvas.height = 720;
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
  canvas.width = 720;
  canvas.height = 720;

  const frameCount = 27;
  const currentFrame = (index) =>
    `assets/flower/flower_out${index.toString().padStart(4, '0')}.jpg`;

  const img = new Image();
  img.src = currentFrame(1);

  img.onload = () => {
    context.drawImage(img, 0, 0);
  };

  const updateImage = (index) => {
    img.src = currentFrame(index);
    context.drawImage(img, 0, 0);
  };

  window.addEventListener('scroll', () => {
    const scrollTop = html.scrollTop;
    // 전체 스크롤 길이
    const maxScrollTop = html.scrollHeight - window.innerHeight;
    // 비율
    const scrollFraction = scrollTop / maxScrollTop;

    const frameIndex = Math.min(
      frameCount - 1,
      Math.ceil(scrollFraction * frameCount)
    );
    // 직접호출보다 성능이 좋음
    requestAnimationFrame(() => updateImage(frameIndex + 1));
  });

  // 캐시를 통해서 성능향상
  // 객체에 담는 방식보단 좋지 않음
  const preloadImages = () => {
    for (let i = 1; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
    }
  };

  preloadImages();
}

document.addEventListener('DOMContentLoaded', () => {
  pageExample02();
});
