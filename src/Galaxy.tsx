export const NUM_STARS = 2500;
export const XDIMENSION = 500000;
export const YDIMENSION = 200000;
export const ZDIMENSION = 20000;
export const MIN_STAR_SIZE = 20;
export const MAX_STAR_SIZE = 100;
export const FOCAL_LENGTH = 10;
export const LINEAR_SPEED = 1;
export const ANGULAR_SPEED = 0.0002;
export const NUM_IMAGE_STARS = 10;

const COLOURS = [
  "#ffffe0",
  "#e0ffff",
  "#f8f8ff",
  "#ffffff",
  "#ffd700",
  "ffff00",
];

export type Star = {
  x: number;
  y: number;
  z: number;
  size: number;
  x2d: number;
  y2d: number;
  size2d: number;
  color: string;
};

export function createGalaxy() {
  const focal = FOCAL_LENGTH;
  const stars: Array<Star> = [];
  for (let i = 0; i < NUM_STARS; i++) {
    const X = (Math.random() - 0.5) * XDIMENSION;
    const Y = (Math.random() - 0.5) * YDIMENSION;
    const Z = Math.random() * ZDIMENSION;
    const size =
      Math.random() * (MAX_STAR_SIZE - MIN_STAR_SIZE) + MIN_STAR_SIZE;
    const x2d = focal * (X / Z);
    const y2d = focal * (Y / Z);
    const size2d = focal * (size / Z);
    stars.push({
      x: X,
      y: Y,
      z: Z,
      size,
      x2d,
      y2d,
      size2d,
      color: COLOURS[Math.round(Math.random() * COLOURS.length) + 1],
    });
  }
  return stars;
}

export function updateGalaxy(
  galaxy: Array<Star>,
  focal: number,
  speed: number,
  time: number
) {
  return galaxy.map((star) => {
    const tmpZ = star.z - speed * time;

    const newZ = tmpZ <= 0 ? ZDIMENSION : tmpZ;
    const x2d = focal * (star.x / newZ);
    const y2d = focal * (star.y / newZ);
    const size2d = focal * (star.size / newZ);

    return {
      ...star,
      ...rotate(star.x, star.y, ANGULAR_SPEED),
      z: newZ,
      x2d,
      y2d,
      size2d,
    };
  });
}

export function rotate(x: number, y: number, angularSpeed: number) {
  const rad = Math.sqrt(x ** 2 + y ** 2);

  if (x > 0) {
    const alpha = Math.atan(y / x);
    const xn = rad * Math.cos(alpha + angularSpeed);
    const yn = rad * Math.sin(alpha + angularSpeed);
    return { x: xn, y: yn };
  } else {
    const alpha = Math.atan(y / Math.abs(x));
    const xn = -1 * rad * Math.cos(alpha - angularSpeed);
    const yn = rad * Math.sin(alpha - angularSpeed);
    return { x: xn, y: yn };
  }
}
