

export const colorOptions = [
 
  "#ff6363", // Red
  "#FF7A6A", // Red-Orange
  "#ff9f74", // Orange
  "#FFC84D", // Yellow
  "#B6E672", // Lime Green
  "#6cdcc4", // Green/Cyan
  "#7AD1DD", // Cyan
  "#5ba7f3", // Blue
  "#8F7FC9", // Softened Indigo
  "#BFA0D5", // Softened Violet
  "#F7A9CB"  // Softened Pink

];


export const randomColor = () => {
  return colorOptions[Math.floor(Math.random() * colorOptions.length)];
};