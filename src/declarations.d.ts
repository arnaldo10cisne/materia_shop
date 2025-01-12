declare module "*.wav" {
  const src: string;
  export default src;
}

declare module "*.mp3" {
  const src: string;
  export default src;
}

declare module "*.scss" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.webp" {
  const src: string;
  export default src;
}
