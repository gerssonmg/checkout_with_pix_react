import React, { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth"
import { useHistory } from 'react-router-dom';

const theme = createTheme();

export default function ResetPassword() {

  const [resetSend, setResetSend] = useState(false)

  const history = useHistory();

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email')

    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent!
        // ..
        setResetSend(true)

      }).catch((error) => {
        if (error?.code === "auth/user-not-found") {
          alert("Usuario não cadastrado.")
        } else if (error?.code === "auth/invalid-email") {
          alert("E-mail informado e invalido")
        } else if (error?.code === "auth/wrong-password") {
          alert("Me parece que a senha esta invalida para esse e-mail")
        } else {
          alert(error.code + "::" + error.message)
        }
      })



  };

  return (
    <ThemeProvider theme={theme}>
      <Button
        variant="contained"
        onClick={() => history.push('/')}
      >
        Voltar
      </Button>

      <Container component="main" maxWidth="xs" style={{ backgroundColor: '#fff', marginBottom: "20px", marginTop: "20px" }}>
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
            Tela de Recuperação de senha
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="E-mail"
              name="email"
              autoComplete="email"
              autoFocus
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Solicitar Nova Senha
            </Button>

            {
              resetSend &&
              <Box>
                <Typography component="h1" variant="h5" style={{ color: "#000" }}>
                  Foi enviado um e-mail para você,
                  <br />
                  com instruções
                  para definir sua nova senha.

                </Typography>
                <Typography component="h1" variant="body1" style={{ color: "#000" }}>
                  Caso não encontre o e-mail, verifique
                  <br />
                  sua caixa de Spam
                </Typography>

                <Button
                  variant="contained"
                  onClick={() => history.push('/login')}
                >
                  Ir para tela de Login
                </Button>
              </Box>
            }

          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}