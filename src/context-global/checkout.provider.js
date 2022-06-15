import React, { useState } from 'react';

import CheckoutContext from './checkout.context';

export default function CheckoutProvider({ children, value }) {
  const [checkout, setCheckout] = useState("_");

  const contextValues = {
    checkout,
    setCheckout,
  };

  return (
    <CheckoutContext.Provider value={contextValues}>
      {children}
    </CheckoutContext.Provider>
  );
}
