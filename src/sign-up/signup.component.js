import React, { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import { useHistory } from 'react-router-dom';
import { getDatabase, ref, set } from "firebase/database";
import {
  emailIsValid,
  nameIsValid,
  isCpfValid,
  isPasswordValid
} from './validators';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { format } from 'date-fns';

const theme = createTheme();

export default function SignUp() {

  const [formNameError, setFormNameError] = useState(false)
  const [formCpfError, setFormCpfError] = useState(false)
  const [formNascimentoError, setFormNascimentoError] = useState(false)
  const [formEmailError, setFormEmailError] = useState(false)
  const [formPasswordError, setFormPasswordError] = useState(false)
  const [formPassword2Error, setFormPassword2Error] = useState(false)

  const [value, setValue] = useState("")


  const auth = getAuth();


  const history = useHistory();

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    // VALIDAS OS CAMPOS
    const email = data.get('email')
    const firstName = data.get('firstName')
    const nascimento = value
    const cpf = data.get('cpf')
    const password = data.get('password')
    const password2 = data.get('password2')


    if (!nameIsValid(firstName)) {
      setFormNameError(true)
      return null
    } else {
      setFormNameError(false)
    }


    if (!isCpfValid(cpf)) {
      setFormCpfError(true)
      return null
    } else {
      setFormCpfError(false)
    }

    if (!nascimento) {
      setFormNascimentoError(true)
      return null
    } else {
      setFormNascimentoError(false)
    }

    if (!emailIsValid(email)) {
      setFormEmailError(true)
      return null
    } else {
      setFormEmailError(false)
    }




    if (!isPasswordValid(password)) {
      setFormPasswordError(true)
      return null
    } else {

      setFormPasswordError(false)
    }

    if (password !== password2) {
      setFormPassword2Error(true)
      return null
    } else {
      setFormPasswordError(false)
    }

    createUserWithEmailAndPassword(auth, data.get('email'), data.get('password'))
      .then((userCredential) => {
        const user = userCredential.user;

        const db = getDatabase();

        set(ref(db, `users/${user.uid}`), {
          email: data.get("email"),
          firstName: data.get("firstName"),
          cpf: data.get("cpf"),
          nascimento: format(value, "dd-MM-yyyy")
        }).then(() => {
          history.push('/perfil')
        });


        // SALVAR RESTANTE DOS DADOS NO REALTIME DATABSE
        // MUDAR DE TELA
      })
      .catch((error) => {
        // MOSTRAR ERROR NA TELA
        const errorCode = error.code;
        const errorMessage = error.message;
        if (error.code === "auth/email-already-in-use") {
          alert("E-mail ja cadastrado")
        }
        else {

          alert(errorCode + "::" + errorMessage)
        }
      });
  };


  return (
    <ThemeProvider theme={theme}>

      <Container component="main" maxWidth="xs" style={{ backgroundColor: "#fff", marginBottom: "20px", marginTop: "20px" }}>
        <Box py={2} maxWidth="xs" display="flex" justifyContent="space-between">
          <Button
            variant="contained"
            onClick={() => history.push('/')}
          >
            Voltar
          </Button>
          <Button
            variant="contained"
            onClick={() => history.push('/login')}
          >
            Ja tem conta? Fazer login
          </Button>
        </Box>
      </Container>

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
                  error={formNameError}
                  helperText={formNameError ? "Informe nome completo" : ""}
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
                  error={formCpfError}
                  helperText={formCpfError ? "CPF invalido. Informe apenas numeros." : ""}
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
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Data de Nascimento"
                    value={value}
                    onChange={(newValue) => {
                      setValue(newValue);
                    }}
                    renderInput={(params) =>
                      <TextField
                        error={formNascimentoError}
                        helperText={formNascimentoError ? "Data de nascimento Invalida" : ""}

                        {...params}
                      />
                    }
                  />
                </LocalizationProvider>
              </Grid>


              <Grid item xs={12}>
                <TextField
                  error={formEmailError}
                  helperText={formEmailError ? "E-mail invalido" : ""}
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
                  error={formPasswordError}
                  helperText={formPasswordError ? "Senha deve ter 6 digitos no minimo" : ""}
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
                  error={formPassword2Error}
                  helperText={"Senhas devem ser iguais"}
                  required
                  fullWidth
                  name="password2"
                  label="Repita a senha"
                  type="password"
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

          </Box>
        </Box>
      </Container>
    </ThemeProvider >
  );
}