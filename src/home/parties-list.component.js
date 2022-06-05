/* eslint-disable */
import React, { useEffect, useState } from 'react'
import './styles.css';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import api from "../services/api";
import Link from '@mui/material/Link';
import { useHistory } from 'react-router-dom';

export default function App() {

  const history = useHistory();
  return (
    <div class="App App-header">
      <>
        Eventos na sua cidade: Montes Claros
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
