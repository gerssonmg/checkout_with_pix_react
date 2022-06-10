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
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { useHistory } from 'react-router-dom';


const theme = createTheme();

export default function SignIn() {

  const history = useHistory();

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email')
    const password = data.get('password')

    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
      history.push('/perfil')
    }).catch((error) => {
      if (error?.code === "auth/user-not-found") {
        alert("Usuario não cadastrado. Faça um cadastro antes de tentar fazer login")
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
            Tela de Login
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
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Entrar
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/recuperar-senha" variant="body2">
                  Recuperar Senha?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/cadastro" variant="body2">
                  {"Criar conta"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}