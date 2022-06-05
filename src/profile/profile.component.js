import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth"

import { useHistory } from 'react-router-dom';

const theme = createTheme();

export default function ProfileComponent() {

  const history = useHistory();

  const auth = getAuth();
  const callSingOut = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
      alert("Sessão encerrada com sucesso")
    }).catch((error) => {
      // An error happened.
      alert(error.code + "::" + error.message)
    });
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);


    // VALIDAS OS CAMPOS
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });

    const auth = getAuth();
    createUserWithEmailAndPassword(auth, data.get('email'), data.get('password'))
      .then((userCredential) => {
        // Signed in
        // const user = userCredential.user;

        // SALVAR RESTANTE DOS DADOS NO REALTIME DATABSE
        // MUDAR DE TELA
      })
      .catch((error) => {
        // MOSTRAR ERROR NA TELA
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // ..
      });
  };

  return (
    <ThemeProvider theme={theme}>
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
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="Nome Completo"
                  autoFocus
                  disabled
                  value="AQU"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="cpf"
                  required
                  fullWidth
                  id="cpf"
                  label="CPF"
                  autoFocus
                  disabled
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="nascimento"
                  required
                  fullWidth
                  id="nascimento"
                  label="Data Nascimento"
                  autoFocus
                  disabled
                />
              </Grid>


              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="E-mail"
                  name="email"
                  disabled
                  autoComplete="email"
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


          <hr size="1" width="100%"></hr>
          <Typography style={{ color: "#000" }}>
            Para o dia:
          </Typography>

          <Typography style={{ color: "#000" }}>
            Valor pago:
          </Typography>

          <Typography style={{ color: "#000" }}>
            Para o dia:
          </Typography>

          <Typography style={{ color: "#000" }}>
            Utilizado:
          </Typography>

          <Typography style={{ color: "#000" }}>
            QR Code:
          </Typography>
        </Box>
      </Container>
    </ThemeProvider >
  );
}