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

/*

export const colorOptions = [
    '#ff6363', // A brighter red.
    '#ff6b8a', // A vibrant pink.
    '#c05dcf', // A rich purple.
    '#b067e9', // A lighter purple.
    '#8a61f5', // A bold indigo.
    '#7175fa', // A lighter indigo.
    '#8eb7ff', // A sky blue.
    '#42e0c0', // A fresh aqua.
    '#4dee8a', // A mint green.
    '#9ef07a', // A lime green.
    '#ffe374', // A warm yellow.
    '#ff9f74', // A peachy orange.
];
*/

export const randomColor = () => {
    return colorOptions[Math.floor(Math.random() * colorOptions.length)];
};