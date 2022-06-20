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

import { getDatabase, set, update, ref, get, child, onValue } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import {
  nameIsValid,
  isCpfValid,
} from '../sign-up/validators';

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
  const [isDateUserCorrect, setIsDateUserCorrect] = useState(false)

  const [idByURL_UseState, setIdByURL_UseState] = useState("")

  const [existCheckoutOpenCPF, setExistCheckoutOpenCPF] = useState(false)

  const [comprarOutraPessoa, setComprarOutraPessoa] = useState(false);


  const [nomeOutraPessoa, setNomeOutraPessoa] = useState("")
  const [cpfOutraPessoa, setCpfOutraPessoa] = useState("")
  const [nascimentoOutraPessoa, setNascimentoOutraPessoa] = useState("")
  const [blockFormOutraPessoa, setBlockFormOutraPessoa] = useState(false)

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

  function existCheckoutOpenForCPF(bilheteParaOutra = false) {

    let exist = false
    onAuthStateChanged(auth, (user) => {
      if (user) {

        const dbRef = ref(getDatabase());
        get(child(dbRef, `users/${user.uid}/bilhetes_online`)).then((snapshot) => {

          if (!snapshot.exists()) {
            requestMercadoPago(bilheteParaOutra)
          }

          else {

            const data = snapshot.val();


            let cpf = userCpf
            if (bilheteParaOutra) {
              cpf = cpfOutraPessoa
            }

            Object.entries(data).map((item) => {
              if (item[1].CPF === cpf && item[1].status == 0 && item[1].idBilhete === bilheteSelected[0][0]) {
                exist = true
                setExistCheckoutOpenCPF(true)
              }
              return null
            })

            if (exist === false) {
              if (existCheckoutOpenCPF) {
                setExistCheckoutOpenCPF(false)
              }

              requestMercadoPago(bilheteParaOutra)
            }
          }

        });
      }
    });

    return null
  }


  function requestMercadoPago(bilheteParaOutra = false) {
    const body =
    {
      "transaction_amount": bilheteSelected[0][1]?.valor || 10,
      "description": bilheteSelected[0][1]?.describe || "Ingresso valido para entrada ate as 16hrs",
      "payment_method_id": "pix",
      "payer": {
        "email": userEmail,
        "first_name": bilheteParaOutra ? nomeOutraPessoa : userName,
        "last_name": bilheteParaOutra ? nomeOutraPessoa : userName,
        "identification": {
          "type": "CPF",
          "number": bilheteParaOutra ? cpfOutraPessoa : userCpf
        }
      },
      "notification_url": "https://us-central1-expomontes2022.cloudfunctions.net/addMessage"
    }

    api
      .post("v1/payments", body)
      .then((response) => {
        const ticket_url = response.data.point_of_interaction.transaction_data.ticket_url

        const id_transation = response.data.id

        const db = getDatabase();

        printy(id_transation)

        onAuthStateChanged(auth, (user) => {

          // CRIANDO O BILHETE DE INTENÇÂO DE COMPRA
          // NA ARVORE DO USUARIO
          set(ref(db, `users/${user.uid}/bilhetes_online/${id_transation}/`), {
            valor: bilheteSelected[0][1]?.valor || 10,
            status: 0,
            CPF: bilheteParaOutra ? cpfOutraPessoa : userCpf,
            nascimento: bilheteParaOutra ? nascimentoOutraPessoa : userNascimento,
            firstName: bilheteParaOutra ? nomeOutraPessoa : userName,
            qr_code: `ON????${id_transation}????${user.uid}`,
            idBilhete: idByURL_UseState,
            id_transation: id_transation,
            link_checkout: ticket_url,
            outraPessoa: bilheteParaOutra
          }).then(() => {
          });

        });

        setBuyForMercadoPago(ticket_url)
        setBlockFormOutraPessoa(true)
      }
      )
      .catch((err) => {
        console.error("ops! ocorreu um erro" + err);
      });
  }

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

      if (isDateUserCorrect) {
        existCheckoutOpenForCPF()
      }
    }
  }, [bilheteSelected, userEmail, userCpf, isDateUserCorrect]);


  const validFormOutraPessoa = () => {

    if (!nameIsValid(nomeOutraPessoa)) {
      alert("Nome imcompleto")
      return null
    }


    if (!isCpfValid(cpfOutraPessoa)) {
      alert("CPF invalido")
      return null
    }

    if (!nascimentoOutraPessoa) {
      alert("Informe data de Nascimento")
      return null
    }

    const bilheteOutraPessoa = true
    existCheckoutOpenForCPF(bilheteOutraPessoa)
  }

  // Loop que verifica se ja foi pago
  function waitforme(milisec, id_transation) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('')
        api
          .get(`v1/payments/${id_transation}`)
          .then(response => {

            const status = response.data.status
            if (status === "approved") {
              onAuthStateChanged(auth, (user) => {

                update(ref(db, `users/${user.uid}/bilhetes_online/${id_transation}/`), {
                  status: 1
                }).then(() => {
                });

                set(ref(db, `abilhetes/${id_transation}`), {
                  bilheteid: id_transation,
                  cortesia: false,
                  status: "1",
                  usuarioid: user.uid
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
    }
  }


  return <>
    <Box mt={4} mb={4}>
      <Button variant="contained" onClick={() => history.push('/')}> {"<-"} Voltar</Button>
    </Box>

    {
      (!buyForMercadoPago && !existCheckoutOpenCPF) && (

        <Box>

          <Box mb={2} style={{ border: "1px solid #535353", fontSize: "20px" }} >
            Verifique os dados a baixo.
            <br />
            Na portaria, sera solicitado
            <br />
            os documentos para comprovar os dados
          </Box>

          {
            !comprarOutraPessoa &&
            <Box mt={4} mb={4}>
              <Button variant="contained" onClick={() => setIsDateUserCorrect(true)}> Clique aqui para continuar</Button>
            </Box>
          }

        </Box>
      )
    }

    {
      !comprarOutraPessoa && !isDateUserCorrect &&
      <Box mt={1} mb={4}>
        <Button
          variant="contained"
          onClick={() => setComprarOutraPessoa(true)}>
          Comprar para outra pessoa
        </Button>
      </Box>
    }


    {
      comprarOutraPessoa && <>
        <FormComprarParaOutraPessoa
          nomeOutraPessoa={nomeOutraPessoa}
          setNomeOutraPessoa={setNomeOutraPessoa}

          cpfOutraPessoa={cpfOutraPessoa}
          setCpfOutraPessoa={setCpfOutraPessoa}

          nascimentoOutraPessoa={nascimentoOutraPessoa}
          setNascimentoOutraPessoa={setNascimentoOutraPessoa}

          blockFormOutraPessoa={blockFormOutraPessoa}
        />
        {
          !blockFormOutraPessoa &&
          <Button
            variant="contained"
            onClick={() => validFormOutraPessoa()}>
            Continuar
          </Button>
        }

      </>
    }

    {
      !comprarOutraPessoa &&
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
    }

    {
      existCheckoutOpenCPF && (

        <Box>

          <Box mb={2} style={{ border: "1px solid #535353", fontSize: "20px" }} >
            Existe um pagamento de bilhete
            <br />
            Pendende para esse CPF. Acesse o
            <br />
            Perfil, para Pagar esse bilhete
          </Box>

          <Box mt={4} mb={4}>
            <Button variant="contained" onClick={() => history.push('/perfil')}> Ir para Perfil</Button>
          </Box>
        </Box>
      )
    }


    {
      buyForMercadoPago &&

      <Box>

        <Box mb={2} style={{ border: "1px solid #535353", fontSize: "20px" }} >
          Aguardando confirmação de pagamento....
        </Box>

        <Box mt={4} mb={4}>
          <Button variant="contained" onClick={() => history.push('/perfil')}> Se ja pagou. Clique aqui para atualizar</Button>
        </Box>

        <Box display="flex">
          <iframe src={buyForMercadoPago} width="400px" height="620px" title="description"></iframe>
        </Box>

      </Box>
    }

  </>
}

function FormComprarParaOutraPessoa(
  {
    nomeOutraPessoa,
    setNomeOutraPessoa,

    cpfOutraPessoa,
    setCpfOutraPessoa,

    nascimentoOutraPessoa,
    setNascimentoOutraPessoa,

    blockFormOutraPessoa
  }
) {



  return (
    <Container component="main" maxWidth="xs" style={{ backgroundColor: "#fff", paddingBottom: "20px", marginBottom: "20px", paddingTop: "20px" }}>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            value={nomeOutraPessoa}
            onChange={e => {
              setNomeOutraPessoa(e.target.value)
            }}
            autoComplete="given-name"
            name="firstName"
            required
            fullWidth
            id="firstName"
            label="Nome Completo"
            autoFocus
            disabled={blockFormOutraPessoa}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            value={cpfOutraPessoa}
            onChange={e => {
              setCpfOutraPessoa(e.target.value)
            }}
            autoComplete="given-name"
            name="cpf"
            required
            fullWidth
            id="cpf"
            label="CPF"
            autoFocus

            disabled={blockFormOutraPessoa}
          />
        </Grid>

        <Grid item xs={12}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Data de Nascimento"

              disabled={blockFormOutraPessoa}
              value={nascimentoOutraPessoa}
              onChange={(newValue) => {
                setNascimentoOutraPessoa(newValue);
              }}
              renderInput={(params) =>
                <TextField
                  {...params}
                />
              }
            />
          </LocalizationProvider>
        </Grid>
      </Grid>
    </Container>
  )
}