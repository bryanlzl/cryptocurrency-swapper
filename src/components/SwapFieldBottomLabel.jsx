import { useState, useEffect } from "react";
import "../styles/swapFieldBottomLabel.css";

function BottomLabel({ swappedCurrency, fieldType, swappedConvRate }) {
  const [message, setMessage] = useState({
    payFieldMessage: "-",
    receiveFieldMessage: "-",
  });

  const createMessage = () => {
    if (fieldType === "pay") {
      const USDvalue = swappedCurrency[fieldType]?.USD || 0;
      let formattedValue = "-";
      if (USDvalue !== 0) {
        if (USDvalue >= 1000000000) {
          formattedValue = `${(USDvalue / 1000000000).toLocaleString("en-US", {
            style: "decimal",
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })}B`;
        } else if (USDvalue >= 1000000) {
          formattedValue = `${(USDvalue / 1000000).toLocaleString("en-US", {
            style: "decimal",
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })}M`;
        } else {
          formattedValue = USDvalue.toLocaleString("en-US", {
            style: "decimal",
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          });
        }
      }
      setMessage((prev) => ({
        ...prev,
        payFieldMessage: `${
          USDvalue !== 0 ? "$" + formattedValue : formattedValue
        }`,
      }));
    } else {
      const RTPRate = swappedConvRate?.receiveToPayRate || null;
      const receiveCurrency = swappedConvRate?.receiveCurrency || "";
      const payCurrency = swappedConvRate?.payCurrency || "";
      setMessage((prev) => ({
        ...prev,
        receiveFieldMessage: RTPRate
          ? `1 ${receiveCurrency} = ${RTPRate.toLocaleString("en-US", {
              style: "decimal",
              maximumFractionDigits: 5,
            })} ${payCurrency}`
          : "-",
      }));
    }
  };

  useEffect(() => {
    createMessage();
  }, [swappedCurrency, swappedConvRate, fieldType]);

  return (
    <p>
      {fieldType === "pay"
        ? message.payFieldMessage
        : message.receiveFieldMessage}
    </p>
  );
}

export default BottomLabel;
