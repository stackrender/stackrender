
import { tags as t } from '@lezer/highlight';
import { EditorView } from '@uiw/react-codemirror';

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



export const overrideDarkTheme = EditorView.theme({
 
  '.cm-content': {
    backgroundColor: "#20252c"
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
      color : "#ff6363"
  } , 
  ".ͼu" : { 
    color : "#B6E672"
  } , 
  ".ͼv": {
      color : "#6cdcc4"
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