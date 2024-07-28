import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger); 

function pageExample05 () {
  makeMainVideo()
  makeSection()
}

const makeMainVideo = () => {
  const html = document.documentElement;
  const canvas = document.getElementById("scrollAnimation");
  const context = canvas.getContext("2d");
  const frameCount = 129;
  const currentFrame = index => (
    `assets/img/dog_${index.toString().padStart(3, '0')}.jpg`
  )

  const img = new Image()
  img.src = currentFrame(1);

  canvas.width = 1280;
  canvas.height = 740;
  img.onload = () =>{
    context.drawImage(img, 0, 0);
  }

  const updateImage = index => {
    img.src = currentFrame(index);
    context.drawImage(img, 0, 0);
  }

  window.addEventListener('scroll', () => {  
    const scrollTop = html.scrollTop;
    const maxScrollTop = html.scrollHeight - window.innerHeight
    const scrollFraction = scrollTop / maxScrollTop;
    
    const frameIndex = Math.min(
      frameCount -1,
      Math.ceil(scrollFraction * frameCount)
    );
    
    requestAnimationFrame(() => updateImage(frameIndex + 1))
  });

  const preloadImages = () => {
    for (let i = 1; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
    }
  };

  preloadImages()
}

const makeSection = () => {
  const sections = document.querySelectorAll(".section");
  const production = document.querySelector(".product-explain");

  const title = document.querySelector(".title");

  const tl = gsap.timeline({
    scrollTrigger: {
        trigger: sections[1], 
        pin: true,
        scrub: 0.3,
        start: "top top",
        end: "+=300%",
        // markers: true,
        toggleActions: "play reverse play reverse"
    }
  });
  tl.from(title, {
      autoAlpha: 0,
      duration: 2,
      ease: "none"
  });
  
  const t2 = gsap.timeline({
      scrollTrigger: {
          trigger: sections[2],
          pin: true,
          scrub: 0.3,
          start: "top top",
          end: "+=300%",
      }
  });
  t2.from(production, {x: '300%', autoAlpha: 0, duration:2, ease: "none", stagger:3})
  .to(production, { duration: 3 })
  
  gsap.to(production.querySelector('.dot'), { duration: 1, opacity: 1, scale: 1.2, repeat: Infinity})

}

document.addEventListener('DOMContentLoaded', () => {
  pageExample05()
})