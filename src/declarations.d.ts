declare module "*.wav" {
  const wav: string;
  export default wav;
}

declare module "*.mp3" {
  const mp3: string;
  export default mp3;
}

declare module "*.scss" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.png" {
  const png: string;
  export default png;
}

declare module "*.webp" {
  const webp: string;
  export default webp;
}
