import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth"
import { useHistory } from 'react-router-dom';
import { getDatabase, ref, set } from "firebase/database";


const theme = createTheme();

export default function SignUp() {
  const auth = getAuth();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        history.push('/perfil')
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
  });

  const history = useHistory();

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);


    // VALIDAS OS CAMPOS
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });

    // const auth = getAuth();
    createUserWithEmailAndPassword(auth, data.get('email'), data.get('password'))
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;

        const db = getDatabase();
        console.log(db)
        set(ref(db, `users/${user.uid}`), {
          email: data.get("email"),
          firstName: data.get("firstName"),
          cpf: data.get("cpf"),
          nascimento: data.get("nascimento")
        });

        history.push('/perfil')

        // SALVAR RESTANTE DOS DADOS NO REALTIME DATABSE
        // MUDAR DE TELA
      })
      .catch((error) => {
        // MOSTRAR ERROR NA TELA
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorCode + "::" + errorMessage)
      });
  };


  return (
    <ThemeProvider theme={theme}>
      <Button
        variant="contained"
        onClick={() => history.push('/')}
      >
        Voltar
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
            Criar Cadastro
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
                />
              </Grid>


              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="E-mail"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Senha"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password2"
                  label="Repita a senha"
                  type="password2"
                  id="password2"
                  autoComplete="new-password"
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
            >
              Cadastrar
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Ja tem conta? Fazer login
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider >
  );
}