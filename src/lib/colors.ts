
import { EditorView } from '@uiw/react-codemirror';
 


export const colorOptions = [
  "#FF6B6B", // Soft Red
  "#FF8966", // Coral Orange
  "#FFB570", // Peach Orange
  "#FFD56B", // Warm Yellow
  "#A5E76E", // Light Lime Green
  "#63D9B7", // Aqua Green
  "#6FD6E3", // Soft Cyan
  "#6CA8F7", // Clear Blue
  "#9A85D6", // Soft Indigo
  "#C7A6E2", // Soft Violet
    "#F7A8D9"  // Soft Pink
];



export const randomColor = () => {
  return colorOptions[Math.floor(Math.random() * colorOptions.length)];
};



export const overrideDarkTheme = EditorView.theme({

  '.cm-content': {
    backgroundColor: "#20252c" ,  
  },
  ".cm-gutter": {
    backgroundColor: "#20252c",
  }, 
  
  ".cm-gutterElement": {
    color: "#4b515a"
  },

  ".ͼp": {
    color: "#A994FF"
  },

  ".cm-line .ͼq": {
    color: "#ff6363"
  },
  ".ͼu": {
    color: "#B6E672"
  },
  ".ͼv": {
    color: "#6cdcc4"
  }

}, { dark: true });



export const overrideLightTheme = EditorView.theme({

  ".ͼb": {
    color: "#2A1D66"
  },
  ".cm-gutterElement": {
    color: "#a2a4a8"
  },
  ".cm-gutter": {
    backgroundColor: "white",

  },
  ".cm-gutters": {
    borderColor: "#f2f4f6"
  },
  ".cm-line": {
    color: "#333639"
  },

});