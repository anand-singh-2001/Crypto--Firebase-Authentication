import axios from "axios";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { CryptoState } from "../CryptoContext";
import { CircularProgress, ThemeProvider, createTheme } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { useParams } from "react-router-dom";
import {
  CategoryScale,
  Chart,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import SelectButton from "./SelectButton";

const CoinInfo = () => {
  const { id } = useParams();
  const [chart, setChart] = useState();
  const [days, setDays] = useState(1);
  const { currency, symbol } = CryptoState();

  Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  ); //removes the not a registered category scale error while using charts.
  const getChartData = async () => {
    const data = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`
    );

    setChart(data.data.prices);
  };

  useEffect(() => {
    getChartData();
  }, [currency, days]);

  // console.log(chart);

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      type: "dark",
    },
  });
  const useStyles = makeStyles()((theme) => {
    return {
      container: {
        width: "75%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 25,
        padding: 40,
        [theme.breakpoints.down("md")]: {
          width: "100%",
          marginTop: 0,
          padding: 20,
          paddingTop: 0,
        },
      },
    };
  });
  const { classes } = useStyles();

  const chartDays = [
    {
      label: "24 Hours",
      value: 1,
    },
    {
      label: "30 Days",
      value: 30,
    },
    {
      label: "3 Months",
      value: 90,
    },
    {
      label: "1 Year",
      value: 365,
    },
  ];
  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.container}>
        {!chart ? (
          <CircularProgress
            style={{ color: "gold" }}
            size={250}
            thickness={1}
          />
        ) : (
          <>
            <Line
              data={{
                labels: chart.map((coin) => {
                  let date = new Date(coin[0]);
                  let time =
                    date.getHours() > 12
                      ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                      : `${date.getHours()}:${date.getMinutes()} AM`;

                  return days === 1 ? time : date.toLocaleDateString();
                }),
                datasets: [
                  {
                    label: `Price (past ${days} days) in ${currency}`,
                    data: chart.map((coin) => coin[1]),
                    borderColor: "#EEBC1D",
                  },
                ],
              }}
              options={{
                elements: {
                  point: {
                    radius: 1, //changing the radius of the point to 1, to remove the bubble like pointer on the chart
                  },
                },
                plugins: {
                  tooltip: {
                    enabled: true,
                  },
                },
              }}
            />
            <div
              style={{
                display: "flex",
                marginTop: 20,
                justifyContent: "space-around",
                width: "100%",
                color: "white",
              }}>
              {chartDays.map((day) => (
                <SelectButton
                  key={day.value}
                  onClick={() => setDays(day.value)}
                  selected={day.value === days}>
                  {day.label}
                </SelectButton>
              ))}
            </div>
          </>
        )}
      </div>
    </ThemeProvider>
  );
};

export default CoinInfo;
