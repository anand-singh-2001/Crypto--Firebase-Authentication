import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CryptoState } from "../CryptoContext";
import { makeStyles } from "tss-react/mui";
import CoinInfo from "../Components/CoinInfo";
import axios from "axios";
import { Button, LinearProgress, Typography } from "@mui/material";
import parse from "html-react-parser";
import { numberWithCommas } from "../Components/Carousel";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../Firebase";

const Coin = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState();
  const { currency, symbol, user, watchlist, setAlert } = CryptoState();

  const getCoinData = async () => {
    const data = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${id}`
    );

    setCoin(data.data);
  };

  useEffect(() => {
    getCoinData();
  }, [currency]);

  // console.log(coin);

  const useStyles = makeStyles()((theme) => {
    return {
      container: {
        display: "flex",
        [theme.breakpoints.down("md")]: {
          //if screen size is less than medium screen
          flexDirection: "column",
          alignItems: "center",
        },
      },
      sidebar: {
        width: "30%",
        [theme.breakpoints.down("md")]: {
          width: "100%",
        },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: 25,
        borderRight: "2px solid grey",
      },
      heading: {
        fontWeight: "bold",
        marginBottom: 20,
        fontFamily: "Montserrat",
      },
      description: {
        width: "100%",
        fontFamily: "Montserrat",
        padding: 25,
        paddingBottom: 15,
        paddingTop: 0,
        textAlign: "center",
      },
      marketData: {
        alignSelf: "start",
        padding: 25,
        paddingTop: 10,
        width: "100%",
      },
    };
  });

  // console.log(coin);

  const inWatchlist = watchlist.includes(coin?.id); //checking if the coin is already added

  const addWatchlist = async () => {
    const coinRef = doc(db, "watchlist", user.uid); //reference to our database. The nesting that we want to create in our database is passed as argument.

    try {
      await setDoc(
        coinRef,
        {
          //adding a doc
          coins: watchlist ? [...watchlist, coin?.id] : [coin?.id],
        },
        { merge: true }
      );

      setAlert({
        open: true,
        message: `${coin.name} added to watchlist`,
        type: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
    }
  };

  const removeFormWatchlist = async () => {
    const coinRef = doc(db, "watchlist", user.uid);
    try {
      await setDoc(
        coinRef,
        {
          coins: watchlist.filter((wish) => wish !== coin.id),
        },
        {
          merge: true,
        }
      );

      setAlert({
        open: true,
        message: `${coin.name} removed from wishlist`,
        type: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
    }
  };

  const { classes } = useStyles();

  if (!coin) return <LinearProgress style={{ backgroundColor: "gold" }} />;

  return (
    <div className={classes.container}>
      <div className={classes.sidebar}>
        <img
          src={coin?.image.large}
          alt={coin?.name}
          height="200"
          style={{ marginBottom: 20 }}
        />
        <Typography variant="h3" className={classes.heading}>
          {coin?.name}
        </Typography>
        <Typography variant="subtitle1" className={classes.description}>
          {" "}
          {/**parse form html-react-parser is used to parse an HTML to string */}
          {parse(`${coin?.description.en.split(".")[0]}`)}.
        </Typography>
        <div className={classes.marketData}>
          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              Rank:
            </Typography>
            &nbsp;&nbsp;
            <Typography variant="h5" style={{ fontFamily: "Montserrat" }}>
              {coin?.market_cap_rank}
            </Typography>
          </span>

          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              Current Price:
            </Typography>
            &nbsp;&nbsp;
            <Typography variant="h5" style={{ fontFamily: "Montserrat" }}>
              {symbol}
              &nbsp;
              {numberWithCommas(
                coin?.market_data.current_price[currency.toLowerCase()]
              )}
            </Typography>
          </span>
          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              Market Cap:
            </Typography>
            &nbsp;&nbsp;
            <Typography variant="h5" style={{ fontFamily: "Montserrat" }}>
              {symbol}
              &nbsp;
              {numberWithCommas(
                coin?.market_data.market_cap[currency.toLowerCase()]
                  .toString()
                  .slice(0, -6)
              )}{" "}
              M
            </Typography>
          </span>

          {user && (
            <Button
              style={{
                width: "100%",
                height: 40,
                backgroundColor: inWatchlist ? "#ff0000" : "#EEBC1D",
                color: inWatchlist ? "white" : "black",
              }}
              onClick={inWatchlist ? removeFormWatchlist : addWatchlist}>
              {inWatchlist ? "Remove From Watchlist" : "Add To Watchlist"}
            </Button>
          )}
        </div>
      </div>
      {/* chart */}
      <CoinInfo />
    </div>
  );
};

export default Coin;
