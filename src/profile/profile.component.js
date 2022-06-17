import React, { useEffect, useState, useContext } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getAuth, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth"
import { getDatabase, ref, onValue } from "firebase/database";
import QRCode from 'qrcode'
import { useHistory } from 'react-router-dom';
import CheckoutContext from '../context-global/checkout.context';
import { QRCodeCanvas } from 'qrcode.react';

const theme = createTheme();

export default function ProfileComponent() {

  const {
    checkout
  } = useContext(CheckoutContext);


  const history = useHistory();

  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [userCpf, setUserCpf] = useState("")
  const [userNascimento, setUserNascimento] = useState("")
  const [bilhetesOnlineByUser, setBilhetesOnlineByUser] = useState([])
  const [qrCode, setQrCode] = useState("")

  const auth = getAuth();
  const callSingOut = () => {
    signOut(auth).then(() => {
      alert("Sessão encerrada com sucesso")
    }).catch((error) => {
      alert(error.code + "::" + error.message)
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
          setUserNascimento(data?.nascimento)
          setUserEmail(data?.email)

          const arr = []
          Object.entries(data.bilhetes_online).map((item) => {
            arr.push({ ...item[1] })
          })


          setBilhetesOnlineByUser(arr || [])
        });
      }
    });

  }, [auth])

  function convertStatus(status) {
    if (status === 0) {
      return "Pagamento pendente"
    } else if (status === 1) {
      return "Disponivel"
    } else if (status === 2) {
      return "Ja foi utilizado"
    }
  }

  // function verificationPayment() {
  //   api
  //     .get(`v1/payments/${id_transation}`)
  //     .then(response => {

  //       const status = response.data.status
  //       if (status === "approved") {
  //         onAuthStateChanged(auth, (user) => {

  //           update(ref(db, `users/${user.uid}/bilhetes_online/${id_transation}/`), {
  //             status: 1
  //           }).then(() => {
  //             history.push('/perfil')
  //           });

  //         })
  //       }

  //     })
  //     .catch(() => { })

  // }

  return (
    <ThemeProvider theme={theme}>
      {checkout}
      <Container component="main" maxWidth="xs" style={{ backgroundColor: "#fff", marginBottom: "20px", marginTop: "20px" }}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5" style={{ color: "#000" }}>
            Seus Dados
          </Typography>
          <Box component="form" noValidate sx={{ mt: 3 }}>
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => history.push('/')}
            >
              Ver Ingresso para comprar
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link onClick={() => callSingOut()} href="/" variant="body">
                  Sair
                </Link>
              </Grid>
            </Grid>
          </Box>

          <Typography component="h1" variant="h5" style={{ color: "#000" }}>
            Seus ingressos:
          </Typography>

          {
            bilhetesOnlineByUser.map((item, index) => {
              return (
                <Box key={index}>
                  <hr size="1" width="100%"></hr>
                  <Typography style={{ color: "#000" }}>
                    Nome: {item.Nome}
                  </Typography>
                  <Typography style={{ color: "#000" }}>
                    CPF: {item.CPF}
                  </Typography>
                  <Typography style={{ color: "#000" }}>
                    Data Nascimento: {item.nascimento}
                  </Typography>

                  <Typography style={{ color: "#000" }}>
                    Valor pago: R${item.valor}
                  </Typography>

                  <Typography style={{ color: "#000" }}>
                    Para o dia: {item.idBilhete}
                  </Typography>

                  {
                    item.status === 0 && (
                      <Link href={item.link_checkout} variant="body1">
                        Clique aqui para pagar
                      </Link>
                    )}

                  <Typography style={{ color: "#000" }}>
                    Status: {
                      convertStatus(item.status)
                    }
                  </Typography>


                  {
                    item.status !== 0 && (
                      <Box>
                        <Typography style={{ color: "#000" }}>
                          QR Code
                        </Typography>
                        <QRCodeCanvas value={item.qr_code} />
                      </Box>
                    )
                  }

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={() => history.push('/')}
                  >
                    Se ja pagou <br />
                    clique aqui para verificarmos
                  </Button>

                </Box>)
            })
          }
        </Box>
      </Container>
    </ThemeProvider >
  );
}