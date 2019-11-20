// Arquivo Principal
//# Carregando Modulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const admin = require('./routes/admin')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')


//Configurações

      //Configurar uma sessao
      app.use(session({
        secret: 'blog',
        resave: true,
        saveUninitialized: true
      }))

      app.use(flash())
      //Criação e Validação de Midleware
      app.use((req, res, next) =>{
        res.locals.success_msg = req.flash('success_msg')
        res.locals.error_msg = req.flash('error_msg')
        next()
      })

      //Bory Parser
      app.use(bodyParser.urlencoded({ extended: true }))
      app.use(bodyParser.json())

      //Handlebars
      //Criação e Validação de Midleware
      app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
      app.set('view engine', 'handlebars')

      //Mangoose
      mongoose.Promise = global.Promise;
      mongoose.connect("mongodb://localhost/blogapp").then(() => {
      console.log('Conectado ao mongo..')
      }).catch((erro) => {
      console.log('Erro ao se conectar: ' + erro);
      })

      //public 
      app.use(express.static(path.join(__dirname, 'public'))) //informa o caminho absoluto dos arquivos staticos


      //Rotas
      app.use('/admin', admin)


      //Outros
      const PORT = 8081
      app.listen(PORT, () => {
      console.log('Servidor Rodando...')
      })
