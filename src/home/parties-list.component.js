/* eslint-disable */
import React, { useEffect, useState } from 'react'
import './styles.css';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import api from "../services/api";
import Link from '@mui/material/Link';
import { useHistory } from 'react-router-dom';
import { getDatabase, get, ref, child, onValue } from "firebase/database";

export default function App() {

  const [arrayBilhetes, setArrayBilhetes] = useState([])

  const db = getDatabase();

  useEffect(() => {
    if (arrayBilhetes.length == 0) {


      const starCountRef = ref(db, 'bilhetes/expomontes2022');
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();

        const arr = []
        Object.entries(data).map((item) => {
          arr.push([item[0], item[1]])
        })
        setArrayBilhetes(arr)

      });


      // get(child(ref(getDatabase()), 'bilhetes/expomontes2022')).then((snapshot) => {
      //   if (snapshot.exists()) {

      //     const data = snapshot.val();

      //     Object.entries(data).map((item) => {
      //       setArrayBilhetes([...arrayBilhetes, item[1]])
      //       console.log('arrayBilhetes')
      //       console.log(arrayBilhetes)
      //     })

      //   } else {
      //     console.log("No data available");
      //   }
      // }).catch((error) => {
      //   console.error(error);
      // });
    }
    console.log(arrayBilhetes)
  }, [arrayBilhetes])

  const history = useHistory();
  return (
    <div class="App App-header">
      <>
        Eventos na sua cidade: Montes Claros

        {
          arrayBilhetes.map((item) => {
            if (item[1].disponivel_para_compra)
              return (
                <Box key={item[0]} style={{ backgroundColor: "#333333" }} display="flex" p={4}>
                  <Box mr={2}>
                    <img width="300px" src={require('../images/logo_item_expo.png')} />
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
                      onClick={() => history.push('/cadastro')}
                    >
                      Comprar
                    </Button>
                  </Box>
                </Box>
              )
          })
        }
        <Box style={{ backgroundColor: "#333333" }} display="flex" p={4}>
          <Box mr={2}>
            <img width="300px" src={require('../images/logo_item_expo.png')} />
          </Box>

          <Box>
            <Box width="100px" style={{ border: "1px solid #535353", fontSize: "20px" }} >
              10 Julho
            </Box>
            <Box style={{ fontSize: "20px" }} >
              _
            </Box>
            <Box style={{ fontSize: "20px", color: "#e60d1e" }} display="flex">
              Ingresso valido para entrada ate as 16hrs
            </Box>
            <Box style={{ fontSize: "30px", color: "#9c1" }} display="flex">
              R$10,00
            </Box>
            <Button
              variant="contained"
              onClick={() => history.push('/cadastro')}
            >
              Comprar
            </Button>
          </Box>
        </Box>
      </>

    </div >
  );
}
