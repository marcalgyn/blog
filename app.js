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

require("./models/Postagem")
const Postagem = mongoose.model("postagens")

require("./models/Categoria")
const Categoria = mongoose.model("categorias")



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
      console.log('Conectado ao mongoDB, http://localhost:8082..')
      }).catch((erro) => {
      console.log('Erro ao se conectar: ' + erro);
      })

      //public 
      app.use(express.static(path.join(__dirname, 'public'))) //informa o caminho absoluto dos arquivos staticos

      app.get("/", (req, res)=>{
        Postagem.find().populate("categoria").sort({data: "desc"}).then((postagens) =>{
          res.render("index", {postagens: postagens})
        }).catch((erro) =>{
          req.flash("error_msg", "Houve um erro interno")
          res.redirect("/404")
        })
        
      })
        
      app.get("/404", (req, res) =>{
        res.send("erro 404!")
      })

      app.get("/postagem/:slug", (req, res) =>{
        Postagem.findOne({slug: req.params.slug}).then((postagem) =>{
          if(postagem){
              res.render("postagem/index", {postagem: postagem})
          }else{
            Request.flash("error_msg", "Esta postagem não existe")
            res.redirect("/")
          }
        }).catch((erro) =>{
          req.flash("erro_msg", "Houve um erro interno")
          res.redirect("/")
        })
      })


      app.get("/categorias", (req, res) =>{

          Categoria.find().then((categorias) => {
            res.render("categorias/index", {categorias: categorias})
          }).catch((erro) =>{
            req.flash("error_msg", "Houve um erro interno")
            res.redirect("/")
          })
      })

      app.get("/categorias/:slug", (req, res) =>{
        Categoria.findOne({slug: req.params.slug}).then((categoria) =>{
          
          if (categoria) {

            Postagem.find({categoria: categoria._id}).then((postagens) =>{
              res.render("categorias/postagens", {postagens: postagens, categoria: categoria})

            }).catch((erro) =>{
              req.flash("error_msg", "Houve um erro ao listar categorias")
              res.redirect("/")
            })

          } else {
            req.flash("error_msg", "Esta Categoria não existe")
            res.redirect("/")
          }

        }).catch((erro) =>{
          req.flash("error_msg", "Houve um erro interno ao carregar pagina desta categoria")
          res.redirect("/")
        })
      })





      //Rotas
      app.use('/admin', admin)


      //Outros
      const PORT = 8082
      app.listen(PORT, () => {
      console.log('Servidor Rodando na porta : ' + PORT)
      })
