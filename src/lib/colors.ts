
export const colorOptions = [
    "#fd7f6f",  // Warm coral red
    "#7eb0d5",  // Soft sky blue
    "#b2e061",  // Fresh lime green
    "#bd7ebe",  // Soft lavender pink
    "#ffb55a",  // Vibrant orange
    "#ffee65",  // Warm yellow
    "#beb9db",  // Light purple grey
    "#fdcce5",  // Light blush pink
    "#8bd3c7",  // Minty teal
    "#f4a1a1",  // Soft peachy red
    "#9bd78c",  // Fresh pastel green
    "#d1a9e0"   // Light lilac purple
    
    
];

export const randomColor = () => {
    return colorOptions[Math.floor(Math.random() * colorOptions.length)];
};