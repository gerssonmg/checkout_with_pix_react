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
    "disponivel_para_compra": false,
    "valor": 10.50,
    "title": "ABC",
    "subtitle": "123",
    "describe": "XXX",
    "url_baner": ""
  },
  "2julho2022": {
    "disponivel_para_compra": false,
    "valor": 10.50,
    "title": "ABC",
    "subtitle": "123",
    "describe": "XXX",
    "url_baner": ""
  },
  "3julho2022": {
    "disponivel_para_compra": false,
    "valor": 10.50,
    "title": "ABC",
    "subtitle": "123",
    "describe": "XXX",
    "url_baner": ""
  },
  "4julho2022": {
    "disponivel_para_compra": false,
    "valor": 10.50,
    "title": "ABC",
    "subtitle": "123",
    "describe": "XXX",
    "url_baner": ""
  },
  "5julho2022": {
    "disponivel_para_compra": false,
    "valor": 10.50,
    "title": "ABC",
    "subtitle": "123",
    "describe": "XXX",
    "url_baner": ""
  },
  "6julho2022": {
    "disponivel_para_compra": false,
    "valor": 10.50,
    "title": "ABC",
    "subtitle": "123",
    "describe": "XXX",
    "url_baner": ""
  },
  "7julho2022": {
    "disponivel_para_compra": false,
    "valor": 10.50,
    "title": "ABC",
    "subtitle": "123",
    "describe": "XXX",
    "url_baner": ""
  },
  "8julho2022": {
    "disponivel_para_compra": false,
    "valor": 10.50,
    "title": "ABC",
    "subtitle": "123",
    "describe": "XXX",
    "url_baner": ""
  },
  "9julho2022": {
    "disponivel_para_compra": false,
    "valor": 10.50,
    "title": "ABC",
    "subtitle": "123",
    "describe": "XXX",
    "url_baner": ""
  },
  "10julho2022": {
    "disponivel_para_compra": false,
    "valor": 10.50,
    "title": "ABC",
    "subtitle": "123",
    "describe": "XXX",
    "url_baner": ""
  },
}

function writeBilhetesSchema() {
  const db = getDatabase();
  console.log(db)
  set(ref(db, 'ROOT/bilhetes/expomontes2022/'), schemaDBBilhetes);
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
  console.log(db)
  set(ref(db, 'ROOT/users/'), [schemaDBUsuarioResponsavel]);
}