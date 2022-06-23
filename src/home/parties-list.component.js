/* eslint-disable */
import React, { useEffect, useState, useContext } from 'react'
import './styles.css';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import api from "../services/api";
import Link from '@mui/material/Link';
import { useHistory } from 'react-router-dom';
import { getDatabase, get, ref, child, onValue } from "firebase/database";
import CheckoutContext from '../context-global/checkout.context';
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth"

export default function App() {

  const {
    checkout,
    setCheckout
  } = useContext(CheckoutContext);


  const [arrayBilhetes, setArrayBilhetes] = useState([])

  const [comprar, setComprar] = useState(false)

  const db = getDatabase();

  useEffect(() => {

    if (arrayBilhetes.length == 0) {

      const starCountRef = ref(db, 'venda_online/bilhetes/expomontes2022');
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();

        const arr = []
        Object.entries(data).map((item) => {
          arr.push([item[0], item[1]])
        })
        setArrayBilhetes(arr)

      });

    }
  }, [arrayBilhetes])


  const history = useHistory();

  const auth = getAuth();


  return (
    <div className="App App-header">
      <>
        {checkout?.id}
        <Box mr={2}>
          <img width="400px" src={require('../images/expoMeio.png')} />
        </Box>

        Eventos na sua cidade: Montes Claros

        <Button
          variant="contained"
          onClick={() => {
            onAuthStateChanged(auth, (user) => {
              if (user) {
                history.push('/perfil')
              } else {
                history.push('/cadastro')
              }
            });

          }}
        >
          Ver Perfil
        </Button>
        <br />
        {
          arrayBilhetes.map((item) => {
            if (item[1].disponivel_para_compra)
              return (
                <Box mx={1} mb={1} border={1} borderColor="#35711a" borderRadius={2} flexWrap="wrap" key={item[0]} style={{ backgroundColor: "#ecf0f0" }} display="flex" p={4}>
                  <Box mr={2}>
                    <img width="300px" src={require('../images/expSuperior.webp')} />
                  </Box>

                  <Box>

                    <Box style={{ fontSize: "20px" }} >
                      {item[1]?.title}
                    </Box>
                    <Box style={{ fontSize: "20px", color: "#e60d1e" }} display="flex">
                      {item[1]?.describe}
                    </Box>
                    <Box justifyContent="center" style={{ fontSize: "30px", color: "#212529" }} display="flex">
                      R$ {item[1]?.valor}
                    </Box>
                    <Button
                      variant="contained"
                      onClick={() => {

                        onAuthStateChanged(auth, (user) => {
                          if (user) {
                            history.push(`/comprar/${item[1].id}`)
                          } else {
                            history.push('/cadastro')
                          }
                        });

                      }}
                    >
                      Comprar
                    </Button>
                  </Box>
                </Box>
              )
          })
        }
      </>

    </div >
  );
}
