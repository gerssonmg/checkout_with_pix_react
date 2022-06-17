import { getDatabase, ref, set } from "firebase/database";

// ATENÇÃO
// LEIAAA
// ESSE CODIGO E EXTREMAMENTE CRITICO. 
// ESSAS FUNÇÕES CRIAM A ESTRUTURA NO BANCO REALTIME DATABASE
// A PARTIR DESSES OBJETOS JSON
// EXECUTAR ELAS PODE SOBRESCREVER OQUE EXISTE NO BANCO
// TENHA MUITO CUIDADO

const schemaDBBilhetes = {
  "1julho2022": {
    "id": "1julho2022",
    "disponivel_para_compra": false,
    "valor": 10.50,
    "title": "1 Julho 2022",
    "subtitle": "_",
    "describe": "Ingresso valido para entrada ate as 16hrs",
    "url_baner": ""
  },
  "2julho2022": {
    "id": "2julho2022",
    "disponivel_para_compra": false,
    "valor": 10.50,
    "title": "2 Julho 2022",
    "subtitle": "_",
    "describe": "Ingresso valido para entrada ate as 16hrs",
    "url_baner": ""
  },
  "3julho2022": {
    "id": "3julho2022",
    "disponivel_para_compra": false,
    "valor": 10.50,
    "title": "3 Julho 2022",
    "subtitle": "_",
    "describe": "Ingresso valido para entrada ate as 16hrs",
    "url_baner": ""
  },
  "4julho2022": {
    "id": "4julho2022",
    "disponivel_para_compra": false,
    "valor": 10.50,
    "title": "4 Julho 2022",
    "subtitle": "_",
    "describe": "Ingresso valido para entrada ate as 16hrs",
    "url_baner": ""
  },
  "5julho2022": {
    "id": "5julho2022",
    "disponivel_para_compra": false,
    "valor": 10.50,
    "title": "5 Julho 2022",
    "subtitle": "_",
    "describe": "Ingresso valido para entrada ate as 16hrs",
    "url_baner": ""
  },
  "6julho2022": {
    "id": "6julho2022",
    "disponivel_para_compra": false,
    "valor": 10.50,
    "title": "6 Julho 2022",
    "subtitle": "_",
    "describe": "Ingresso valido para entrada ate as 16hrs",
    "url_baner": ""
  },
  "7julho2022": {
    "id": "7julho2022",
    "disponivel_para_compra": true,
    "valor": 10.50,
    "title": "7 Julho 2022",
    "subtitle": "_",
    "describe": "Ingresso valido para entrada ate as 16hrs",
    "url_baner": ""
  },
  "8julho2022": {
    "id": "8julho2022",
    "disponivel_para_compra": false,
    "valor": 10.50,
    "title": "8 Julho 2022",
    "subtitle": "_",
    "describe": "Ingresso valido para entrada ate as 16hrs",
    "url_baner": ""
  },
  "9julho2022": {
    "id": "9julho2022",
    "disponivel_para_compra": true,
    "valor": 10.50,
    "title": "9 Julho 2022",
    "subtitle": "_",
    "describe": "Ingresso valido para entrada ate as 16hrs",
    "url_baner": ""
  },
  "10julho2022": {
    "id": "10julho2022",
    "disponivel_para_compra": false,
    "valor": 10.50,
    "title": "10 Julho 2022",
    "subtitle": "_",
    "describe": "Ingresso valido para entrada ate as 16hrs",
    "url_baner": ""
  },
}

export function writeBilhetesSchema() {
  const db = getDatabase();
  set(ref(db, 'venda_online/bilhetes/expomontes2022/'), schemaDBBilhetes);
}


const schemaDBIngresso = {
  "qrcode": "",
  "createdAt": "",
  "data_utilizacao": "",
  "status": "",
  "grupo": "",
  "qual_dia_evento": ""
}

const schemaDBUsuarioDependente = {
  "nome": "",
  "data_nascimento": "",
  "ingressos": [
    schemaDBIngresso
  ]
}

const schemaDBSolicitacoesCompra = {
  "id_transacao": "",
  "createdAt": "",
  "grupo_ingresso": "",
  "status": ""
}

const schemaDBUsuarioResponsavel = {
  "nome": "",
  "data_nascimento": "",
  "email": "",
  "cpf": "",
  "telefone": "",
  "createdAt": "",
  "updatedAt": "",
  "solicitacoes_de_compras": [schemaDBSolicitacoesCompra],
  "ingressos": [schemaDBIngresso],
  "dependentes": [schemaDBUsuarioDependente]
}


function writeUserData() {
  const db = getDatabase();
  set(ref(db, 'ROOT/users/'), [schemaDBUsuarioResponsavel]);
}