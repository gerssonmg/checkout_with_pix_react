import React, { useEffect, useState, useContext } from 'react'
import '../home/styles.css';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import api from "../services/api";
import Link from '@mui/material/Link';
import { useHistory } from 'react-router-dom';

import CheckoutContext from '../context-global/checkout.context';

export default function CheckoutPixComponent({ setShowStory, setShowPixComponent }) {

  const [buyForMercadoPago, setBuyForMercadoPago] = useState("");

  const {
    checkout
  } = useContext(CheckoutContext);



  const body =
  {
    "transaction_amount": checkout?.valor,
    "description": "Título do produto",
    "payment_method_id": "pix",
    "payer": {
      "email": "caarolleal23@gmail.com",
      "first_name": "Test",
      "last_name": "User",
      "identification": {
        "type": "CPF",
        "number": "11764666666"
      },
      "address": {
        "zip_code": "06233200",
        "street_name": "Av. das Nações Unidas",
        "street_number": "3003",
        "neighborhood": "Bonfim",
        "city": "Osasco",
        "federal_unit": "SP"
      }
    },
    "notification_url": "https://us-central1-expomontes2022.cloudfunctions.net/addMessage"
  }

  useEffect(() => {
    api
      .post("v1/payments", body)
      .then((response) => {
        const ticket_url = response.data.point_of_interaction.transaction_data.ticket_url

        setBuyForMercadoPago(ticket_url)
      }
      )
      .catch((err) => {
        console.error("ops! ocorreu um erro" + err);
      });
  }, []);

  return <>
    <Button variant="contained" onClick={() => {
      setShowStory(true)
      setShowPixComponent(false)
    }}> {"<-"} Voltar</Button>

    {
      buyForMercadoPago &&

      <Box display="flex">
        <iframe src={buyForMercadoPago} width="340px" height="620px" title="description"></iframe>
      </Box>
    }
    <Box mt={5} style={{ border: "1px solid #535353", fontSize: "20px" }} >
      Aguardando confirmação de pagamento....
    </Box>

  </>
}