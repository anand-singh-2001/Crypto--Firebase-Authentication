import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "./Firebase";
import { doc, onSnapshot } from "firebase/firestore";

const Context = createContext();
const CryptoContext = ({ children }) => {
  const [currency, setCurrency] = useState("INR");
  const [symbol, setSymbol] = useState("₹");
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setuser] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    type: "success",
  });
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    if (user) {
      const coinRef = doc(db, "watchlist", user.uid);

      var unsubscribe = onSnapshot(coinRef, (coin) => {
        if (coin.exists()) {
          //exists() to check if it exists

          console.log(coin.data());
          setWatchlist(coin.data().coins);
        } else {
          console.log("No items in watchlist");
        }
      }); //onSnapshot checks if our database is updated.

      return () => {
        unsubscribe(); //runs when the component is unmounted
      };
    }
  }, [user]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) setuser(user);
      else setuser(null);

      // console.log(user);
    });
  }, []);
  const fetchCoins = async () => {
    setLoading(true);
    const { data } = await axios.get(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en`
    );
    setCoins(data);
    setLoading(false);
  };
  useEffect(() => {
    if (currency === "INR") setSymbol("₹");
    else if (currency === "USD") setSymbol("$");
  }, [currency]);

  return (
    <Context.Provider
      value={{
        currency,
        symbol,
        setCurrency,
        coins,
        loading,
        fetchCoins,
        alert,
        setAlert,
        user,
        watchlist,
      }}>
      {children}
    </Context.Provider>
  );
};

export default CryptoContext;

export const CryptoState = () => {
  return useContext(Context);
};
