import { useState, useEffect } from "react";
import { TextField, InputLabel, Button } from "@mui/material";
import useStyles from "../styles/swapFieldStyles";
import { ArrowDropDown, ExpandMore } from "@mui/icons-material";
import BottomLabel from "./SwapFieldBottomLabel";
import "../styles/SwapField.css";

function SwapField(props) {
  const currency = props.currency;
  const fieldType = props.fieldType;
  const { swappedConvRate, setSwappedConvRate } = props.currentConversion;
  const { modalState, setModalState } = props.triggerModal;
  const { swappedCurrency, setSwappedCurrency } = props.swappedCurrencySetting;
  const [isHovered, setIsHovered] = useState(false);
  const swapFieldStyles = useStyles();
  const [amount, setAmount] = useState(0);
  const currencySelected = swappedCurrency[fieldType]["currency"];

  const handleChange = (event) => {
    event.target.value !== 0 ? setAmount(event.target.value) : setAmount(0);
    setSwappedCurrency((prev) => {
      const payCurrencyRate =
        fieldType === "pay" && prev[fieldType]["currency"] !== ""
          ? currency[prev[fieldType]["currency"]]["price"]
          : 0;
      const receiveCurrencyRate =
        fieldType === "receive" && prev[fieldType]["currency"] !== ""
          ? currency[prev[fieldType]["currency"]]["price"]
          : 0;
      const payUSDvalue =
        fieldType === "pay" && prev[fieldType]["currency"] !== ""
          ? event.target.value * payCurrencyRate
          : 0;
      const receiveUSDvalue =
        fieldType === "receive" && prev[fieldType]["currency"] !== ""
          ? event.target.value * receiveCurrencyRate
          : 0;
      if (
        swappedCurrency[fieldType]["currency"] !== "" &&
        fieldType === "pay"
      ) {
        return {
          ...prev,
          [fieldType]: {
            ...prev[fieldType],
            amount: Number(event.target.value),
            USD: payUSDvalue,
          },
          receive: {
            ...prev.receive,
            currency:
              prev.receive.currency !== "" ? prev.receive.currency : "USD",
            amount:
              prev.receive.currency !== ""
                ? payUSDvalue / currency[prev.receive["currency"]]["price"]
                : payUSDvalue,
          },
        };
      } else if (fieldType === "pay") {
        return {
          ...prev,
          [fieldType]: {
            ...prev[fieldType],
            amount: Number(event.target.value),
          },
        };
      } else if (
        swappedCurrency[fieldType]["currency"] !== "" &&
        fieldType === "receive"
      ) {
        return {
          ...prev,
          [fieldType]: {
            ...prev[fieldType],
            amount: Number(event.target.value),
          },
          pay: {
            ...prev.pay,
            USD: receiveUSDvalue,
            currency: prev.pay.currency !== "" ? prev.pay.currency : "USD",
            amount:
              prev.pay.currency !== ""
                ? receiveUSDvalue / currency[prev.pay["currency"]]["price"]
                : receiveUSDvalue,
          },
        };
      } else {
        return {
          ...prev,
          [fieldType]: {
            ...prev[fieldType],
            amount: Number(event.target.value),
          },
        };
      }
    });
  };

  const amountPlaceholder =
    props.fieldType === "pay" ? "Sell Amount" : "Receive Amount";

  const openModalHandler = () => {
    setModalState((prev) => {
      return { ...prev, isOpen: !prev.isOpen, openFor: props.fieldType };
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const currencyDisplay =
    currencySelected === "" ? (
      <div className="currency-display">
        <p>Select Token</p>
        <ExpandMore className="dropdown-icon" />
      </div>
    ) : (
      <div className="currency-display">
        <img
          src={`/assets/tokens/${currencySelected}.svg`}
          alt={currencySelected}
        />
        <p>{currencySelected}</p>
        <ArrowDropDown fontSize="small" htmlColor="#4a4a4a" />
      </div>
    );

  useEffect(() => {
    setAmount(swappedCurrency[fieldType]["amount"]);
  }, [swappedCurrency]);

  return (
    <div>
      <div className="swapFieldMain">
        <Button
          onClick={openModalHandler}
          sx={{
            textTransform: "none",
            color: "#4a4a4a",
            fontWeight: "bold",
            fontSize: "20px",
            letterSpacing: "-0.5px",
            padding: "8px 5px 8px 5px",
            maxHeight: "100px",
            backgroundColor: "#dfdfdf",
            borderRadius: "15px",
            borderBottomLeftRadius: "0",
            borderBottomRightRadius: "0",
            "&:hover": {
              textShadow: "0 0 5px rgba(97, 159, 218, 1)",
              backgroundColor: "#efefef",
            },
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {currencyDisplay}
        </Button>
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <TextField
            id="filled-number"
            label={amountPlaceholder}
            type="number"
            InputLabelProps={{
              shrink: true,
              style: { fontSize: "18px", letterSpacing: "-0.5px" },
            }}
            value={amount !== 0 && amount}
            variant="filled"
            onChange={handleChange}
            InputProps={{
              disableUnderline: true,
              placeholder: amount === 0 ? "0" : "",
              sx: {
                borderRadius: "0 !important",
                height: "60px",
                fontSize: "25px",
                padding: "0px 20px 0px 20px !important",
                backgroundColor: `${isHovered && "#000000"}`,
                color: `${isHovered && "#000000"}`,
              },
            }}
            inputProps={{
              onKeyDown: (event) => event.key === "-" && event.preventDefault(),
              className: "custom-input-class",
              onWheel: (event) => {
                event.target.blur();
              },
            }}
            className={`${swapFieldStyles.noArrows} ${swapFieldStyles.amountField}`}
          />
          <InputLabel
            sx={{
              borderRadius: "0",
              borderBottomLeftRadius: "15px",
              borderBottomRightRadius: "15px",
              backgroundColor: "#dfdfdf",
              color: "#4d4d4d",
              fontSize: "13px",
              fontWeight: "bold",
              padding: "3px 20px 0px 20px",
              height: "20px",
              borderTop: "1px",
              borderColor: "#dfdfdf",
            }}
          >
            <BottomLabel
              swappedCurrency={swappedCurrency}
              swappedConvRate={swappedConvRate}
              fieldType={fieldType}
            ></BottomLabel>
          </InputLabel>
        </div>
      </div>
    </div>
  );
}

export default SwapField;
