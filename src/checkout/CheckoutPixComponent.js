import React, { useEffect, useState, useContext } from 'react'
import '../home/styles.css';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import api from "../services/api";
import Link from '@mui/material/Link';
import { useHistory } from 'react-router-dom';

import CheckoutContext from '../context-global/checkout.context';
import { useLocation } from 'react-router-dom';

import { getDatabase, get, ref, child, onValue } from "firebase/database";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth"

export default function CheckoutPixComponent() {

  const [buyForMercadoPago, setBuyForMercadoPago] = useState("");
  const [arrayBilhetes, setArrayBilhetes] = useState([])
  const [bilheteSelected, setBilheteSelected] = useState("")

  const db = getDatabase();

  const history = useHistory();

  const location = useLocation();


  useEffect(() => {
    if (arrayBilhetes.length == 0) {
      const starCountRef = ref(db, 'venda_online/bilhetes/expomontes2022');
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();

        const arr = []
        Object.entries(data).map((item) => {
          arr.push([item[0], item[1]])
        })
        setArrayBilhetes(arr)

      });

    } else {
      setBilheteSelected(arrayBilhetes.filter(item => {
        const idByUrl = location.pathname.split("/")
        return item[1].id === idByUrl[2]
      }))
    }
  }, [arrayBilhetes])


  const auth = getAuth();

  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [userCpf, setUserCpf] = useState("")

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const db = getDatabase();
        const starCountRef = ref(db, 'users/' + user.uid);
        onValue(starCountRef, (snapshot) => {
          const data = snapshot.val();

          setUserCpf(data?.cpf)
          setUserName(data?.firstName)
          setUserEmail(data?.email)
        });
      }
    });

  })


  useEffect(() => {
    if (bilheteSelected && userEmail && userCpf) {
      const body =
      {
        "transaction_amount": bilheteSelected[0][1]?.valor || 10,
        "description": bilheteSelected[0][1]?.describe || "Ingresso valido para entrada ate as 16hrs",
        "payment_method_id": "pix",
        "payer": {
          "email": userEmail,
          "first_name": userName,
          "last_name": userName,
          "identification": {
            "type": "CPF",
            "number": userCpf
          }
        },
        "notification_url": "https://us-central1-expomontes2022.cloudfunctions.net/addMessage"
      }

      api
        .post("api.mercadopago.com/v1/payments", body)
        .then((response) => {
          const ticket_url = response.data.point_of_interaction.transaction_data.ticket_url

          setBuyForMercadoPago(ticket_url)
        }
        )
        .catch((err) => {
          console.error("ops! ocorreu um erro" + err);
        });
    }
  }, [bilheteSelected, userEmail, userCpf]);

  return <>
    <Button variant="contained" onClick={() => history.push('/')}> {"<-"} Voltar</Button>

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