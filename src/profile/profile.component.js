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
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth"
import { getDatabase, get, child, update, set, ref, onValue } from "firebase/database";

import { useHistory } from 'react-router-dom';
import CheckoutContext from '../context-global/checkout.context';
import QRCode, { QRCodeCanvas } from 'qrcode.react';
import api from "../services/api";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


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

  const [formUpdateUserName, setFormUpdateUserName] = useState("")
  const [formUpdateUserCPF, setFormUpdateUserCPF] = useState("")
  const [formUpdateUserNascimento, setFormUpdateUserNascimento] = useState("")


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

          setFormUpdateUserCPF(data?.cpf)
          setFormUpdateUserName(data?.firstName)
          setFormUpdateUserNascimento(data?.nascimento)

          const arr = []
          Object.entries(data.bilhetes_online).map((item) => {
            arr.push({ ...item[1] })
          })


          setBilhetesOnlineByUser(arr || [])
        });
      }
    });

  }, [auth])

  function convertStatus(status, qrCode) {
    if (status === 0) {
      return "Pagamento pendente"
    } else if (status === 1 && qrCode !== "") {
      return "Disponivel"
    }
    else if (status === 1 && qrCode === "") {
      return "Ja foi utilizado"
    }
    else if (status === 2) {
      return "Ja foi utilizado"
    }
  }

  const [qrcodeFinal, setQrcodeFinal] = useState("")
  const [showDialogQrCode, setShowDialogQrCode] = useState(false)

  useEffect(() => {

    console.log('qrcodeFinal')
    console.log(qrcodeFinal)
    if (qrcodeFinal !== "")
      setShowDialogQrCode(true)

  }, [qrcodeFinal]);

  const verQrCode = async (id_transation) => {
    let qrcode = ""
    console.log("AQUI")
    console.log(id_transation)

    setQrcodeFinal(false)
    // const db = getDatabase();
    // const starCountRef = ref(db, 'abilhetes/' + id_transation);
    // let response = onValue(starCountRef, (snapshot) => {
    //   const data = snapshot.val();
    //   if (data) {
    //     // setQrCode(`${data.bilheteid}`)
    //     console.log("AQUI2")
    //     qrcode = data.bilheteid
    //   } else {
    //     // setQrCode("")
    //   }
    //   return data.bilheteid
    // });

    const dbRef = ref(getDatabase());
    await get(child(dbRef, 'abilhetes/' + id_transation)).then((snapshot) => {

      const data = snapshot.val();

      setQrcodeFinal(data.bilheteid)
      // setShowDialogQrCode(true)
      // console.log(data.bilheteid)
    });

    // console.log('response')
    // // console.log(response)
    // console.log("AQUI")
    // return qrcode
  }


  function verificationPayment(id_transation) {

    const db = getDatabase();

    api
      .get(`v1/payments/${id_transation}`)
      .then(response => {

        const status = response.data.status
        if (status === "approved") {
          onAuthStateChanged(auth, (user) => {

            update(ref(db, `users/${user.uid}/bilhetes_online/${id_transation}/`), {
              status: 1
            }).then(() => {
              alert("Pagamento identificado com sucesso")
            });


            set(ref(db, `abilhetes/${id_transation}`), {

              bilheteid: id_transation,
              cortesia: false,
              status: "1",
              usuarioid: user.uid
            }).then(() => {
            });


          })
        } else {
          alert("Pagamento ainda não identificado. Tente novamente mais tarde.")
        }

      })
      .catch(() => { })

  }


  const [Xopen, setXOpen] = useState(false);

  const handleClickOpen = () => {
    setXOpen(true);
  };

  const handleClose = () => {
    setXOpen(false);
  };

  function EditDialog() {
    return (
      <div>

        <Dialog open={Xopen} onClose={handleClose}>
          <DialogTitle>Edite seus dados</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To subscribe to this website, please enter your email address here. We
              will send updates occasionally.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Nome"
              type="email"
              fullWidth
              variant="standard"
              value={formUpdateUserName}
            />
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="CPF"
              type="email"
              fullWidth
              variant="standard"
              value={formUpdateUserCPF}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Data de Nascimento"
                value={formUpdateUserNascimento}
                onChange={(newValue) => {
                  setFormUpdateUserNascimento(newValue);
                }}
                renderInput={(params) =>
                  <TextField
                    // error={formNascimentoError}
                    // helperText={formNascimentoError ? "Data de nascimento Invalida" : ""}

                    {...params}
                  />
                }
              />
            </LocalizationProvider>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleClose}>Continuar</Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
  return (
    <ThemeProvider theme={theme}>
      {checkout}

      <EditDialog />
      <Button variant="outlined" onClick={() => setXOpen(true)}>
        Open form dialog
      </Button>
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
          <Typography component="h1" variant="body1" style={{ color: "#000" }}>
            Apresente seu QRcode na portaria do evento
          </Typography>

          <br />
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
                      convertStatus(item.status, qrcodeFinal)
                    }
                  </Typography>

                  {/* {
                    item.status !== 0 && getQrCode(item.id_transation)
                  } */}

                  {

                    item.status !== 0 && < Button onClick={() => verQrCode(item.id_transation)}>Ver QRcode</Button>
                  }

                  {
                    item.status !== 0 && qrCode !== "" && (
                      <Box>
                        <Typography style={{ color: "#000" }}>
                          QR Code
                        </Typography>
                        <QRCodeCanvas value={qrcodeFinal} />
                        <Typography style={{ color: "#000" }}>
                          00X{qrcodeFinal}ZYT
                        </Typography>
                      </Box>
                    )
                  }

                  {
                    <Dialog
                      open={qrcodeFinal !== "" && showDialogQrCode}
                      onClose={() => setShowDialogQrCode(false)}
                    >
                      <DialogContent>
                        {/*value should string */}
                        <QRCodeCanvas value={"" + qrcodeFinal} />
                      </DialogContent>
                    </Dialog>
                  }

                  {
                    item.status === 0 &&
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                      onClick={() => verificationPayment(item.id_transation)}
                    >
                      Se ja pagou <br />
                      clique aqui para verificarmos
                    </Button>
                  }

                </Box>)
            })
          }
        </Box>
        <br />
        <br />
      </Container>
    </ThemeProvider >
  );
}