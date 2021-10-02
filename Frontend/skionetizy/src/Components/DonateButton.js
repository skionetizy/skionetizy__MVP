import React, { useEffect, useRef } from "react";
import Button from "../Components/Button";

function DonateButton({ className, children }) {
  /**
   * @type {{ current: HTMLFormElement }}
   */
  const formRef = useRef(null);

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
    <>
      <div className={className}>
        <form ref={formRef} className="hidden" id="donate"></form>
      </div>
      <Button
        onClick={() =>
          formRef.current?.getElementsByTagName("a")?.item(0)?.click()
        }
      >
        {children}
      </Button>
    </>
  );
}

export default DonateButton;
