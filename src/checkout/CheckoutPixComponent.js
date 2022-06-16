import React, { useEffect, useState } from 'react'
import '../home/styles.css';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import api from "../services/api";
import { useHistory } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { useLocation } from 'react-router-dom';

import { getDatabase, set, update, ref, onValue } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth"


export default function CheckoutPixComponent() {

  const [buyForMercadoPago, setBuyForMercadoPago] = useState("");
  const [arrayBilhetes, setArrayBilhetes] = useState([])
  const [bilheteSelected, setBilheteSelected] = useState("")

  const db = getDatabase();

  const history = useHistory();

  const location = useLocation();

  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [userCpf, setUserCpf] = useState("")
  const [userNascimento, setUserNascimento] = useState("")

  const [idByURL_UseState, setIdByURL_UseState] = useState("")

  useEffect(() => {
    const idByUrl = location.pathname.split("/")
    setIdByURL_UseState(idByUrl[2])
  }, [location])


  useEffect(() => {
    if (arrayBilhetes.length === 0) {
      const starCountRef = ref(db, 'venda_online/bilhetes/expomontes2022');

      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        const arr = []
        Object.entries(data).map((item) => arr.push([item[0], item[1]]))
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
          setUserNascimento(data?.nascimento)
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


      console.log("API")
      console.log(api)
      api.get(`https://jsonplaceholder.typicode.com/users`)
        .then(res => {
          const persons = res.data;
          console.log('persons')
          console.log(persons)
        })


      api
        .get(`api.mercadopago.com/v1/payments/23208174649`)
        .then(response => {

          console.log('response GET MERCADO')
          console.log(response)


        })
        .catch(() => { })

      const sendGetRequest = async () => {
        try {
          const resp = await api
            .post("api.mercadopago.com/v1/payments", body)
            .then((response) => {
              console.log('response')
              console.log(response)
              const ticket_url = response.data.point_of_interaction.transaction_data.ticket_url

              const id_transation = response.data.id

              const db = getDatabase();

              printy(id_transation)

              onAuthStateChanged(auth, (user) => {

                set(ref(db, `users/${user.uid}/bilhetes_online/${id_transation}/`), {
                  valor: bilheteSelected[0][1]?.valor || 10,
                  status: 0,
                  CPF: userCpf,
                  nascimento: userNascimento,
                  Nome: userName,
                  qr_code: `ON????${id_transation}????${user.uid}`,
                  idBilhete: idByURL_UseState,
                  link_checkout: ticket_url
                }).then(() => {
                  // history.push('/perfil')
                });

              });

              setBuyForMercadoPago(ticket_url)
            }
            )
            .catch((err) => {
              console.error("ops! ocorreu um erro" + err);
            });
        } catch (err) {
          // Handle Error Here
          console.error("ZZZ");
          console.error(err);
        }
      };

      sendGetRequest()
    }
  }, [bilheteSelected, userEmail, userCpf]);



  function waitforme(milisec, id_transation) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('')
        api
          .get(`api.mercadopago.com/v1/payments/${id_transation}`)
          .then(response => {

            const status = response.data.status
            if (status === "approved") {
              onAuthStateChanged(auth, (user) => {

                update(ref(db, `users/${user.uid}/bilhetes_online/${id_transation}/`), {
                  status: 1
                }).then(() => {
                  history.push('/perfil')
                });

              })
            }

          })
          .catch(() => { })
      }, milisec);
    })
  }

  async function printy(id_transation) {
    for (let i = 0; i < 10; ++i) {
      await waitforme(10000, id_transation);
      console.log(i);
    }
    console.log("Loop execution finished!)");
  }


  return <>
    <Button variant="contained" onClick={() => history.push('/')}> {"<-"} Voltar</Button>

    <Container component="main" maxWidth="xs" style={{ backgroundColor: "#fff", paddingBottom: "20px", marginBottom: "20px", paddingTop: "20px" }}>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            autoComplete="given-name"
            name="firstName"
            fullWidth
            id="firstName"
            label="Nome Completo"
            autoFocus
            disabled
            value={userName}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            autoComplete="given-name"
            name="cpf"
            label="CPF"
            fullWidth
            id="cpf"
            value={userCpf}
            autoFocus
            disabled
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            autoComplete="given-name"
            name="nascimento"
            label="Data Nascimento"
            fullWidth
            id="nascimento"
            value={userNascimento}
            autoFocus
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="E-mail"
            id="email"
            name="email"
            disabled
            value={userEmail}
          />
        </Grid>

        <Grid item xs={12}>

        </Grid>
      </Grid>
    </Container>

    {
      buyForMercadoPago &&


      <Box display="flex">
        <iframe src={buyForMercadoPago} width="400px" height="620px" title="description"></iframe>
      </Box>
    }
    <Box mt={5} style={{ border: "1px solid #535353", fontSize: "20px" }} >
      Aguardando confirmação de pagamento....
    </Box>

  </>
}