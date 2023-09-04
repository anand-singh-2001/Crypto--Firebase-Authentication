import { makeStyles } from "tss-react/mui";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { CryptoState } from "../CryptoContext";
import AliceCarousel from "react-alice-carousel";
import { Link } from "react-router-dom";

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
const Carousel = () => {
  const [trending, setTrending] = useState([]);

  const useStyles = makeStyles()(() => {
    return {
      carousel: {
        height: "50%",
        display: "flex",
        alignItems: "center",
      },
      carouselItem: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
        textTransform: "uppercase",
        color: "white",
      },
    };
  });
  const { currency, symbol } = CryptoState();
  const { classes } = useStyles();

  const fetchTrendingCoins = async () => {
    const { data } = await axios.get(
      `http://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=gecko_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h&locale=en`
    );

    // console.log(data);
    setTrending(data);
  };

  useEffect(() => {
    fetchTrendingCoins();
  }, [currency]);
  // console.log(trending);

  const items = trending.map((coin) => {
    let profit = coin.price_change_percentage_24h >= 0;
    return (
      <Link className={classes.carouselItem} to={`/coins/${coin.id}`}>
        <img
          src={coin.image}
          alt="Coin image"
          height="80"
          style={{ marginBottom: 10 }}
        />
        <span>
          {coin?.symbol}
          &nbsp;
          <span
            style={{
              color: profit ? "rgb(14,203,129)" : "red",
              fontWeight: 500,
            }}>
            {profit && "+"} {coin?.price_change_percentage_24h}%
          </span>
        </span>

        <span style={{ fontSize: 22, fontWeight: 500 }}>
          {symbol}
          {numberWithCommas(coin?.current_price.toFixed(2))}
        </span>
      </Link>
    );
  });

  return (
    <div className={classes.carousel}>
      <AliceCarousel
        mouseTracking
        infinite
        autoPlayInterval={1000}
        animationDuration={1500}
        disableDotsControls
        disableButtonsControls
        responsive={{
          0: {
            items: 2,
          },
          512: {
            items: 4,
          },
        }}
        autoPlay
        items={items}
      />
    </div>
  );
};

export default Carousel;
