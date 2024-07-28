import gsap from "gsap";
import ScrollToPlugin from "gsap/ScrollToPlugin";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin); 

function pageExample06 () {
  makeMainVideo()
  makeSection()
  makeHeader()
  makeFooter()
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

  const preloadImages = () => {
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
    }
  };

  preloadImages();

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
}

const makeSection = () => {
  const sections = document.querySelectorAll(".section");
  const icons = document.querySelectorAll(".icon-container img")
  const production = document.querySelector(".product-explain");

  const imgSection = document.querySelector(".img-container")

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
      ease: "power3.inOut"
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


  gsap.set(icons[2], { rotateZ: 35});
  const t3 = gsap.timeline({
      scrollTrigger: {
          trigger: sections[3], 
          start: "top top",
          end: "+=300%",
          // markers: true,
          pin: true,
          toggleActions: "play reverse play reverse"
      },
      ease: "elastic.inOut(1.2, 0.75)",
  });
  t3.from(icons, { 
    opacity: 0, 
    scale: 0,
    stagger: 0.04  
  });

  const t4 = gsap.timeline()
  t4.fromTo(imgSection, {
    y: -100
  },
  {
    y: 0,
    scale: 0.8,
    duration: 2,
    ease: "power4.out",
    scrollTrigger: {
      pin: sections[4],
      // markers: true,
      scrub: true,
      start: "top center",
      end: "+=10000",
      invalidateOnRefresh: true
    }
  })

}

const makeHeader = () => {
  const body = document.querySelector("body");
  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
      body.classList.remove("up");
      return;
    }
    
    if (currentScroll > lastScroll && !body.classList.contains("down")) {
      body.classList.remove("up");
      body.classList.add("down");
    } else if (currentScroll < lastScroll && body.classList.contains("down")) {
      body.classList.remove("down");
      body.classList.add("up");
    }
    lastScroll = currentScroll;
  });
};

const makeFooter = () => {
  const footerNav = document.querySelector(".footer-nav");
  footerNav.querySelector('.nav-1').addEventListener("click",()=>{
    gsap.to(window, { duration: 1, scrollTo: "#TOP" });
  })
}


document.addEventListener('DOMContentLoaded', () => {
  pageExample06()
})