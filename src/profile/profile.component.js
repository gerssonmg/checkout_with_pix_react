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
import { QRCodeCanvas } from 'qrcode.react';
import api from "../services/api";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { format } from 'date-fns';
import { nameIsValid, isCpfValid, } from '../sign-up/validators';

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

  function convertStatus(status, qrCode) {
    if (status === 0) {
      return "Pagamento pendente"
    } else if (status === 1 && qrCode !== "" && qrCode !== "utilizado") {
      return "Disponivel"
    }
    else if (status === 1 && qrCode === "utilizado") {
      return "Ja foi utilizado"
    }
    else if (status === 2) {
      return "Ja foi utilizado"
    }
  }

  const [qrcodeFinal, setQrcodeFinal] = useState("")
  const [showDialogQrCode, setShowDialogQrCode] = useState(false)

  useEffect(() => {

    if (qrcodeFinal !== "" && qrcodeFinal !== "utilizado")
      setShowDialogQrCode(true)

  }, [qrcodeFinal]);

  const verQrCode = async (id_transation) => {

    setQrcodeFinal("")

    const dbRef = ref(getDatabase());
    await get(child(dbRef, 'abilhetes/' + id_transation)).then((snapshot) => {

      if (snapshot.exists()) {
        const data = snapshot.val();
        setQrcodeFinal(data.bilheteid)
      } else {
        setQrcodeFinal("utilizado")
      }
    });

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

  const [openEditUser, setOpenEditUser] = useState(false);
  const [openEditBilhete, setOpenEditBilhete] = useState(false);


  return (
    <ThemeProvider theme={theme}>
      {checkout}

      {
        openEditUser && <EditDialog
          name={userName}
          cpf={userCpf}
          nascimento={userNascimento}
          setOpen={setOpenEditUser}
          open={openEditUser}
        />
      }

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
            <Button style={{ marginLeft: "8px" }} variant="outlined" onClick={() => setOpenEditUser(true)}>
              Atualizar Dados
            </Button>
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
                  <Button
                    size="small"
                    style={{ marginLeft: "8px" }}
                    variant="outlined"
                    onClick={() => setOpenEditBilhete(true)}>
                    Atualizar dados do bilhete
                  </Button>
                  {
                    openEditBilhete && <EditDialog
                      name={item.Nome}
                      cpf={item.CPF}
                      nascimento={item.nascimento}
                      setOpen={setOpenEditBilhete}
                      id_transation={item.id_transation}
                      open={openEditBilhete}
                    />
                  }
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

                  {
                    qrcodeFinal !== "" && <Typography style={{ color: "#000" }}>
                      Status: {
                        convertStatus(item.status, qrcodeFinal)
                      }
                    </Typography>
                  }

                  {

                    item.status !== 0 && <Button
                      onClick={() => verQrCode(item.id_transation)}>
                      Clique aqui para ver o QRcode
                    </Button>
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

function EditDialog({ name, cpf, nascimento, open, setOpen, id_transation = 0 }) {


  const [formUpdateUserName, setFormUpdateUserName] = useState(name)
  const [formUpdateUserCPF, setFormUpdateUserCPF] = useState(cpf)
  const [formUpdateUserNascimento, setFormUpdateUserNascimento] = useState(nascimento)

  const db = getDatabase();

  const auth = getAuth();

  const updateUser = () => {

    if (!nameIsValid(formUpdateUserName)) {
      alert("Preencha nome completo")
      return null
    }


    if (!isCpfValid(formUpdateUserCPF)) {
      alert("CPF invalido")
      return null
    }

    if (!formUpdateUserNascimento) {
      alert("Data nascimento invalida")
      return null
    }
    onAuthStateChanged(auth, (user) => {

      const pathEdit = id_transation === 0 ?
        `users/${user.uid}/` :
        `users/${user.uid}/bilhetes_online/${id_transation}`
      console.log(formUpdateUserNascimento)

      update(ref(db, pathEdit), {
        cpf: formUpdateUserCPF,
        firstName: formUpdateUserName,
        nascimento: formUpdateUserNascimento.length === 10 ?
          formUpdateUserNascimento :
          format(formUpdateUserNascimento, "dd-MM-yyyy"),
      }).then(() => {
        window.location.reload()
      }).catch(err => {
        alert(err)
      });
    })

  }

  return (
    <div>

      <Dialog open={open} onClose={() => setOpen(false)} >
        <DialogTitle>Edite seus dados</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Apos editar, clique em salvar.
          </DialogContentText>
          <form id="myform" component="form" noValidate sx={{ mt: 3 }}>
            <TextField
              autoFocus
              id="name"
              label="Nome"
              fullWidth
              onChange={e => {
                e.preventDefault();
                setFormUpdateUserName(e.target.value)

              }}
              value={formUpdateUserName}
            />
            <TextField
              margin="dense"
              id="CPF"
              fullWidth
              onChange={e => {
                e.preventDefault();
                setFormUpdateUserCPF(e.target.value)
              }}
              value={formUpdateUserCPF}
            />
            <br />
            <br />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Data de Nascimento"
                value={formUpdateUserNascimento}
                onChange={(newValue) => {
                  setFormUpdateUserNascimento(newValue);
                }}
                renderInput={(params) =>
                  <TextField
                    {...params}
                  />
                }
              />
            </LocalizationProvider>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={() => updateUser()}>Atualizar</Button>
        </DialogActions>
      </Dialog>
    </div >
  )
}
