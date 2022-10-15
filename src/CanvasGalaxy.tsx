import { useEffect, useRef, useState } from "react";

import {
  ANGULAR_SPEED,
  createGalaxy,
  FOCAL_LENGTH,
  LINEAR_SPEED,
  NUM_IMAGE_STARS,
  Star,
  updateGalaxy,
} from "./Galaxy";

const CFURL = "https://d1gcydps05b4aa.cloudfront.net/images/";

type StarImage = {
  image: HTMLImageElement;
  x: number;
  y: number;
  size: number;
};

function cf(img: string) {
  return `${CFURL}${img}`;
}

export default function CanvasGalaxy(props: {}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameCnt = useRef<number>(0);
  const requestIdRef = useRef<number | null>(null);
  const [starImages, setStarImages] = useState<StarImage[]>([]);
  const [background, setBackground] = useState<HTMLImageElement | null>(null);

  const stars = useRef<Star[]>(createGalaxy());

  useEffect(() => {
    async function loadImages() {
      const background = await loadImage(cf("nebula5.jpeg"));
      const image1 = await loadImage(cf("star1.png"));
      const image2 = await loadImage(cf("star2.png"));
      const image3 = await loadImage(cf("star3.png"));
      const image4 = await loadImage(cf("star4.png"));
      const image5 = await loadImage(cf("star5.png"));
      const image6 = await loadImage(cf("star6.png"));
      const iSun = await loadImage(cf("sun2.png"));
      const x = (Math.random() - 0.5) * window.innerWidth;
      const y = (Math.random() - 0.5) * window.innerHeight;
      const maxSize = 4;

      const initialImages: Array<StarImage> = [];

      for (let i = 0; i < NUM_IMAGE_STARS; i++) {
        initialImages.push(
          {
            image: image1,
            x,
            y,
            size: (Math.random() + 1) * maxSize,
          },
          {
            image: image2,
            x,
            y,
            size: (Math.random() + 1) * maxSize,
          },
          {
            image: image3,
            x,
            y,
            size: (Math.random() + 1) * maxSize,
          },
          {
            image: image4,
            x,
            y,
            size: (Math.random() + 1) * maxSize,
          },
          {
            image: image5,
            x,
            y,
            size: (Math.random() + 1) * maxSize,
          },
          {
            image: image6,
            x,
            y,
            size: (Math.random() + 1) * maxSize,
          },
          {
            image: iSun,
            x,
            y,
            size: 10,
          }
        );
      }

      setStarImages((stars) => [...stars, ...initialImages]);
      setBackground(background);
    }
    if (starImages.length === 0) {
      loadImages();
    }
  }, [starImages]);

  useEffect(() => {
    function draw(ctx: CanvasRenderingContext2D, frame: number) {
      if (!background) {
        return;
      }

      let x = window.innerWidth / 2;
      let y = window.innerHeight / 2;
      let width = background.width;
      let height = background.height;
      ctx.translate(x, y);

      ctx.rotate(-ANGULAR_SPEED);
      ctx.drawImage(background, -width / 2, -height / 2, width, height);

      ctx.translate(-x, -y);

      for (let i = starImages.length; i < stars.current.length; i++) {
        const x = stars.current[i].x2d;
        const y = stars.current[i].y2d;
        const rad = stars.current[i].size2d;

        if (rad > 0.01) {
          ctx.fillStyle = stars.current[i].color;
          ctx.beginPath();
          const xScreen = x + window.innerWidth / 2;
          const yScreen = window.innerHeight - (y + window.innerHeight / 2);
          ctx.arc(xScreen, yScreen, rad, 0, 2 * Math.PI, false);
          ctx.fill();
        }
      }

      for (let i = 0; i < starImages.length; i++) {
        const x = stars.current[i].x2d;
        const y = stars.current[i].y2d;
        const size = stars.current[i].size2d;

        const img = starImages[i].image;

        const xScreen = x + window.innerWidth / 2;
        const yScreen = window.innerHeight - (y + window.innerHeight / 2);

        const width = size * 50;
        const height = width / (img.width / img.height);

        ctx.drawImage(img, xScreen, yScreen, width, height);
      }

      stars.current = updateGalaxy(stars.current, FOCAL_LENGTH, LINEAR_SPEED, 1);
    }

    const canvas = canvasRef.current;

    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#111";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      }
    }

    const render = (frameCount: number) => {
      if (canvas) {
        const context = canvas.getContext("2d");
        if (context) {
          draw(context, frameCount);
          requestIdRef.current = requestAnimationFrame(render);
        }
      }
    };

    requestIdRef.current = requestAnimationFrame(render);

    frameCnt.current = frameCnt.current + 1;

    return () => {
      if (requestIdRef.current) {
        window.cancelAnimationFrame(requestIdRef.current);
      }
    };
  }, [starImages, background]);

  return <canvas className="canvas" ref={canvasRef} {...props} />;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = function () {
      resolve(image);
    };
    image.src = src;
  });
}
