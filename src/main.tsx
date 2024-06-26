import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "primereact/resources/themes/mdc-light-indigo/theme.css";
// import "primereact/resources/themes/mdc-dark-indigo/theme.css";
// import "primereact/resources/themes/viva-light/theme.css";
// import "primereact/resources/themes/mdc-light-deeppurple/theme.css";
// import "primereact/resources/themes/mdc-dark-deeppurple/theme.css";


import "primereact/resources/primereact.min.css";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
