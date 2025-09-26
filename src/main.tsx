 
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import { UIProviders } from "./provider.tsx";
import "./styles/globals.css";
import "./index.css";

import "./i18/index.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
   
    <BrowserRouter>
      <UIProviders>
        <App />
      </UIProviders>
    </BrowserRouter> ,
);
