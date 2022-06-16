/* eslint-disable */
import React, { useEffect, useState, useContext } from 'react'
import './styles.css';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import api from "../services/api";
import Link from '@mui/material/Link';
import { useHistory } from 'react-router-dom';
import { getDatabase, get, ref, child, onValue } from "firebase/database";
// import { writeBilhetesSchema } from '../database/schema'
import CheckoutContext from '../context-global/checkout.context';
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth"

export default function App() {

  // writeBilhetesSchema()

  const {
    checkout,
    setCheckout
  } = useContext(CheckoutContext);


  const [arrayBilhetes, setArrayBilhetes] = useState([])

  const [comprar, setComprar] = useState(false)

  const db = getDatabase();

  console.log("V02")
  useEffect(() => {
    console.log("AQUI00")
    if (arrayBilhetes.length == 0) {

      console.log("AQUI")

      const starCountRef = ref(db, 'venda_online/bilhetes/expomontes2022');
      console.log(starCountRef)
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();

        const arr = []
        Object.entries(data).map((item) => {
          arr.push([item[0], item[1]])
        })
        console.log(arr)
        setArrayBilhetes(arr)

      });

    }
  }, [arrayBilhetes])


  const history = useHistory();

  const auth = getAuth();


  return (
    <div class="App App-header">
      <>
        {checkout?.id}
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
        {
          arrayBilhetes.map((item) => {
            if (item[1].disponivel_para_compra)
              return (
                <Box key={item[0]} style={{ backgroundColor: "#333333" }} display="flex" p={4}>
                  <Box mr={2}>
                    <img width="300px" src={require('../images/claudio.jpg')} />
                  </Box>

                  <Box>
                    <Box width="100px" style={{ border: "1px solid #535353", fontSize: "20px" }} >
                      {/* 10 Julho */}
                      {item[1]?.data}
                    </Box>
                    <Box style={{ fontSize: "20px" }} >
                      {item[1]?.title}
                    </Box>
                    <Box style={{ fontSize: "20px", color: "#e60d1e" }} display="flex">
                      {/* Ingresso valido para entrada ate as 16hrs */}
                      {item[1]?.describe}
                    </Box>
                    <Box style={{ fontSize: "30px", color: "#9c1" }} display="flex">
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
