import "./App.css";
import { BrowserRouter } from "react-router-dom";
import Url from "./components/routes/path";
import "./components/homepage/aboutus.css";
import "./components/homepage/aboutus.css";
import { SnackbarProvider } from "notistack";

function App() {
  return (
    <BrowserRouter>
      <SnackbarProvider
        iconVariant={{
          success: "✅ ",
          error: "✖️ ",
          warning: "⚠️ ",
          info: "ℹ️ ",
        }}
      />
      <Url />
    </BrowserRouter>
  );
}

export default App;
