import React, { useState } from 'react';
import PropTypes from 'prop-types';

import CheckoutContext from './checkout.context';

export default function CheckoutProvider({ children, value }) {
  const [checkout, setCheckout] = useState("asd");

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
