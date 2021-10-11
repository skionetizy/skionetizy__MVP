import React, { useEffect, useRef } from "react";
import Button from "../Components/Button";

let count = 1;

function DonateButton({ variant, children }) {
  /**
   * @type {{ current: HTMLFormElement }}
   */
  const formRef = useRef(null);

  const id = ++count;

  useEffect(() => {
    const Script = document.createElement("script");
    const Form = document.getElementById("donate" + id);
    Script.setAttribute(
      "src",
      "https://checkout.razorpay.com/v1/payment-button.js"
    );
    Script.setAttribute("data-payment_button_id", "pl_HdWpJwt72aKvjW");
    Form.appendChild(Script);
  }, []);

  return (
    <>
      {variant === "default" ? (
        <div>
          <form ref={formRef} id={"donate" + id}></form>
        </div>
      ) : (
        <>
          <div>
            <form ref={formRef} className="hidden" id={"donate" + id}></form>
          </div>
          <Button
            variant={variant || "secondary"}
            onClick={() =>
              formRef.current?.getElementsByTagName("a")?.item(0)?.click()
            }
          >
            {children}
          </Button>
        </>
      )}
    </>
  );
}

export default DonateButton;
