const { gsap } = require('gsap');

function pageExample03() {
  const html = document.documentElement;
  const canvas = document.getElementById('scrollAnimation');
  const context = canvas.getContext('2d');

  const frameCount = 130;
  const currentFrame = (index) =>
    `assets/img/dog_${index.toString().padStart(3, '0')}.jpg`;

  const img = new Image();
  img.src = currentFrame(1);
  canvas.width = 1280;
  canvas.height = 740;
  img.onload = function () {
    context.drawImage(img, 0, 0);
  };

  const updateImage = (index) => {
    img.src = currentFrame(index);
    context.drawImage(img, 0, 0);
  };

  window.addEventListener('scroll', () => {
    const scrollTop = html.scrollTop;
    const maxScrollTop = html.scrollHeight - window.innerHeight;
    const scrollFraction = scrollTop / maxScrollTop;

    const frameIndex = Math.min(
      frameCount - 1,
      Math.ceil(scrollFraction * frameCount)
    );

    requestAnimationFrame(() => updateImage(frameIndex + 1));
  });

  const preloadImages = () => {
    for (let i = 1; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
    }
  };

  preloadImages();
}

function makeSection() {
  const t1 = gsap.to('.box1', { rotation: 27, x: 120, duration: 1 });
  document.querySelector('.restart').addEventListener('click', () => {
    t1.restart();
  });
  document.querySelector('.start').addEventListener('click', () => {
    t1.play();
  });
  document.querySelector('.pause').addEventListener('click', () => {
    t1.pause();
  });
  gsap.from('.box2', { rotation: 27, x: 120, duration: 1 });
  gsap.fromTo('.box3', { x: -100 }, { rotation: 27, x: 120, duration: 1 });
}

document.addEventListener('DOMContentLoaded', () => {
  pageExample03();
  makeSection();
});
