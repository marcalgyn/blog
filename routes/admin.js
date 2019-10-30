
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')

const Categoria = mongoose.model('categorias')


router.get('/', (req, res) =>{
    res.render('admin/index')
})


router.get('/categorias', (req, res) =>{
    res.render('admin/categorias')
})

router.get('/categorias/add', (req, res) =>{
    
    res.render('admin/addcategorias')
})


router.post('/categorias/nova', (req, res) =>{
    var erros = []

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null ){
        erros.push({text: 'Nome Invalido'})
    } else {
        if (req.body.nome.length < 2 ){
            erros.push({text: 'Nome da categoria muito pequeno'})
        }
    }
    
    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null ){
        erros.push({text: 'Slug Invalido'})
    }

   

    if (erros.length > 0 ){
        res.render('admin/addcategorias', {erros: erros})
    }


    const novaCategoria = {
        nome: req.body.nome,
        slug: req.body.slug
    }

    new Categoria(novaCategoria).save().then(() =>{
        req.flash('success_msg', 'Categoria Cadastrada com Sucesso')
        res.redirect('/admin/categorias')
    }).catch((erro) =>{
        req.flash('error_msg', 'Houve um erro ao salvar a categorias' + erro)
        res.redirect('/admin')
    })
    
})




module.exports = router