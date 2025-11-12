import { useState, useEffect } from "react";
import { Button, Box, Tooltip } from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import SwapField from "./SwapField";
import SelectionModal from "./modal/SelectionModal";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import CompletionModal from "./modal/CompletionModal";
import "../styles/CurrencySwap.css";

function CurrencySwap(props) {
  const currency = props.currency;
  const [modalState, setModalState] = useState({ isOpen: false, openFor: "" });
  const [completionModalState, setCompletionModalState] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const triggerModal = { modalState: modalState, setModalState: setModalState };
  const triggerCompModal = {
    completionModalState: completionModalState,
    setCompletionModalState: setCompletionModalState,
  };
  const [swappedCurrency, setSwappedCurrency] = useState({
    pay: { currency: "", amount: 0, USD: 0 },
    receive: { currency: "", amount: 0 },
  });
  const [swappedConvRate, setSwappedConvRate] = useState({
    payCurrency: 0,
    receiveCurrency: 0,
    receiveToPayRate: 0,
  });
  const currentConversion = {
    swappedConvRate: swappedConvRate,
    setSwappedConvRate: setSwappedConvRate,
  };

  const handleCurrencySwap = () => {
    setSwappedCurrency((prev) => {
      return {
        ...prev,
        pay: {
          currency: prev.receive.currency,
          amount: prev.receive.amount,
          USD: prev.pay.USD,
        },
        receive: { currency: prev.pay.currency, amount: prev.pay.amount },
      };
    });
  };

  const swappedCurrencySetting = {
    swappedCurrency: swappedCurrency,
    setSwappedCurrency: setSwappedCurrency,
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const renderSwapIcon = isHovered ? (
    <SwapHorizIcon fontSize="large" htmlColor="#dfdfdf" />
  ) : (
    <DoubleArrowIcon fontSize="large" htmlColor="#dfdfdf" />
  );

  const onSubmitHandler = (event) => {
    setCompletionModalState(!completionModalState);
    event.preventDefault();
  };

  useEffect(() => {
    const payCurrency = swappedCurrency.pay.currency;
    const receiveCurrency = swappedCurrency.receive.currency;
    payCurrency &&
      receiveCurrency &&
      setSwappedConvRate((prev) => {
        const receiveToPayRate =
          currency[receiveCurrency].price / currency[payCurrency].price;
        return {
          payCurrency: payCurrency,
          receiveCurrency: receiveCurrency,
          receiveToPayRate: receiveToPayRate,
        };
      });
  }, [swappedCurrency]);

  return (
    <form onSubmit={onSubmitHandler} className="main">
      <Box className="swap-interface">
        <SwapField
          fieldType="pay"
          triggerModal={triggerModal}
          swappedCurrencySetting={swappedCurrencySetting}
          currentConversion={currentConversion}
          currency={currency}
        />
        <Tooltip
          title="Swap Currency"
          arrow
          slotProps={{
            popper: {
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, -5],
                  },
                },
              ],
            },
          }}
        >
          <Button
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            disableRipple
            disableFocusRipple
            style={{
              height: "80px",
              position: "relative",
              marginTop: "30px",
              width: "auto",
            }}
            onClick={handleCurrencySwap}
          >
            {renderSwapIcon}
          </Button>
        </Tooltip>

        <SwapField
          fieldType="receive"
          triggerModal={triggerModal}
          swappedCurrencySetting={swappedCurrencySetting}
          currentConversion={currentConversion}
          currency={currency}
        />
      </Box>
      <Button
        variant="contained"
        className="swap-button"
        type="submit"
        sx={{
          marginTop: "10px",
          height: "30px",
          width: "700px",
          backgroundColor: "#9ebede",
          fontWeight: "bold",
          letterSpacing: "-0.5px",
          color: "#303030",
          borderRadius: "10px",
          "&:hover": {
            backgroundColor: "#868bac",
            color: "lightgray",
          },
        }}
      >
        Exchange
      </Button>
      <SelectionModal
        triggerModal={triggerModal}
        currency={currency}
        swappedCurrencySetting={swappedCurrencySetting}
      />
      <CompletionModal
        triggerCompModal={triggerCompModal}
        currency={currency}
        swappedCurrencySetting={swappedCurrencySetting}
      />
    </form>
  );
}

export default CurrencySwap;
