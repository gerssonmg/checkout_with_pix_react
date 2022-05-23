import React, { useEffect, useState } from 'react'
import './styles.css';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import api from "../services/api";
// import Logo from '..images/logo_item_expo.png';
// import { writeUserData } from '../database/firebase-realtime'
function App() {

  const [showStory, setShowStory] = useState(true)
  const [showPixComponent, setShowPixComponent] = useState(false)

  return (

    <div className="App App-header">
      {showStory && <StoryComponent setShowStory={setShowStory} setShowPixComponent={setShowPixComponent} />}
      {showPixComponent && <CheckoutPixComponent setShowStory={setShowStory} setShowPixComponent={setShowPixComponent} />}
    </div >
  );
}

function StoryComponent({ setShowStory, setShowPixComponent }) {
  // writeUserData()

  return (
    <>
      Eventos na sua cidade: Montes Claros
      <Box style={{ backgroundColor: "#333333" }} display="flex" p={4}>
        <Box mr={2}>
          <img width="300px" src={require('../images/logo_item_expo.png')} class="img-responsive" />
        </Box>

        <Box>
          <Box width="100px" style={{ border: "1px solid #535353", fontSize: "20px" }} >
            10 Julho
          </Box>
          <Box style={{ fontSize: "20px" }} >
            _
          </Box>
          <Box style={{ fontSize: "20px", color: "#e60d1e" }} display="flex">
            Ingresso valido para entrada ate as 16hrs
          </Box>
          <Box style={{ fontSize: "30px", color: "#9c1" }} display="flex">
            R$10,00
          </Box>
          <Button variant="contained" onClick={() => {
            setShowStory(false)
            setShowPixComponent(true)
          }
          }>Comprar</Button>
        </Box>
      </Box>
    </>
  )
}

function CheckoutPixComponent({ setShowStory, setShowPixComponent }) {

  const [buyForMercadoPago, setBuyForMercadoPago] = useState("");

  const body =
  {
    "transaction_amount": 2,
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

  // writeUserData()
  // readUserData()

  useEffect(() => {
    api
      .post("api.mercadopago.com/v1/payments", body)
      .then((response) => {
        console.log(response)
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
export default App;
