import React, { useEffect } from "react";

function DonateButton() {
  useEffect(() => {
    const Script = document.createElement("script");
    const Form = document.getElementById("donate");
    Script.setAttribute(
      "src",
      "https://checkout.razorpay.com/v1/payment-button.js"
    );
    Script.setAttribute("data-payment_button_id", "pl_HdWpJwt72aKvjW");
    Form.appendChild(Script);
  }, []);
  return (
    <div>
      <form id="donate"></form>
    </div>
  );
}

export default DonateButton;
