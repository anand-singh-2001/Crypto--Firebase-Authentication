import { Container, Typography } from "@mui/material";
import React from "react";
import { makeStyles } from "tss-react/mui";
import Carousel from "./Carousel";

const Banner = () => {
  const useStyles = makeStyles()(() => {
    return {
      banner: {
        backgroundImage: "url(./Images/bg2.avif)",
      },
      bannerContent: {
        height: 400,
        display: "flex",
        flexDirection: "column",
        paddingTop: "25",
        justifyContent: "space-around",
      },
      tagLine: {
        display: "flex",
        height: "40%",
        flexDirection: "column",
        justifyContent: "center",
        textAlign: "center",
      },
    };
  });

  const { classes } = useStyles();
  return (
    <div className={classes.banner}>
      <Container className={classes.bannerContent}>
        <div className={classes.tagLine}>
          <Typography
            variant="h2"
            style={{
              fontWeight: "bold",
              marginBottom: 15,
              fontFamily: "Montserrat",
            }}>
            Crypto Hunter
          </Typography>
          <Typography
            variant="subtitle1"
            style={{
              color: "white",
              textTransform: "capitalize",
              fontFamily: "Montserrat",
            }}>
            Get all the INFO regarding your favourite Crypto Currency
          </Typography>
        </div>
        <Carousel />
      </Container>
    </div>
  );
};

export default Banner;
