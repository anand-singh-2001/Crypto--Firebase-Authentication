import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./Components/Header";
import Home from "./Pages/Home";
import Coin from "./Pages/Coin";
import { makeStyles } from "tss-react/mui";
import "react-alice-carousel/lib/alice-carousel.css";
import Alert from "./Components/Alert";

function App() {
  const useStyles = makeStyles()(() => {
    return {
      App: {
        backgroundColor: "#14161a",
        color: "white",
        minHeight: "100vh",
      },
    };
  });

  const { classes } = useStyles();

  return (
    <BrowserRouter>
      <div className={classes.App}>
        <Header />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/coins/:id" element={<Coin />} />
        </Routes>
        <Alert />
      </div>
    </BrowserRouter>
  );
}

export default App;
