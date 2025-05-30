/*
export const colorOptions = [
    "#fd7f6f",  // Warm coral red
    "#7eb0d5",  // Soft sky blue
    "#b2e061",  // Fresh lime green
 
    "#ffb55a",  // Vibrant orange
    "#ffee65",  // Warm yellow
    "#beb9db",  // Light purple grey
    "#fdcce5",  // Light blush pink
    "#8bd3c7",  // Minty teal
    "#f4a1a1",  // Soft peachy red
    "#9bd78c",  // Fresh pastel green
    "#d1a9e0"   // Light lilac purple
    
    
];





export const colorOptions = [
    
  "#835dffAA",
  "#fa8c16AA",
  "#5fe9a0AA",  // this one appears as #5f80e9 but you may have meant #5fcba0 or similar
  "#61cba0AA",
  "#e2578dAA",
  "#ec3e3eAA",
  "#5bbfd4AA",
  "#b49461AA",
  "#4971a6AA",
  "#9b6065AA"

]
  */

export const colorOptions = [
    "#835CFFAA", // Light Hot Magenta
    "#26cea4AA", // Light Selective Yellow
    "#ffb400AA", // Light Neon Violet
    "#097bedAA", // Light Deep Sky Blue
    "#F92814AA",  // Light Black (Gray)
    "#7958F0AA", 
    "#FF47A5AA"
];
 

export const randomColor = () => {
    return colorOptions[Math.floor(Math.random() * colorOptions.length)];
};