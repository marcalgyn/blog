
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')

const Categoria = mongoose.model('categorias')


router.get('/', (req, res) =>{
    res.render('admin/index')
})


router.get('/categorias', (req, res) =>{
    Categoria.find().sort({date:'desc'}).then((categorias) =>{
        res.render('admin/categorias', {categorias: categorias})
    }).catch((erro) =>{
        req.flash('error_msg', 'Ouve erro ao tentar listar categoria' + erro)
    })
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


router.get('/categorias/edit/:id', (req, res) =>{
    Categoria.findOne({_id: req.params.id}).then((categoria)=>{
        res.render('admin/editcategorias', {categoria: categoria});
    }).catch((erro) => {
        req.flash('error_msg', 'Esta categoria não exite' + erro)
        res.redirect('/admin/categorias')

    })
    
})

router.post('/categorias/edit', (req, res)=>{

    //***** Criar um sistema de validação no futuro nesta parte ******/

    Categoria.findOne({_id: req.body.id}).then((categoria)=>{
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug
    
        categoria.save().then(()=>{
            req.flash('success_msg', 'Categoria editada com sucesso!!')
            res.redirect('/admin/categorias')
        }).catch((erro)=>{
            req.flash('error_msg', 'Houve um erro interno ao salvar a edição da categoria'+ erro)
            res.redirect('/admin/categorias')
        })
    }).catch((erro)=>{
        req.flash('error_msg', 'Houve um erro interno ao Editar categoria'+ erro)
        res.redirect('/admin/categorias')
    })
})

router.post('/categorias/deletar', (req, res) =>{
    
    Categoria.remove({_id: req.body.id}).then(()=>{
        req.flash('success_msg', 'Categoria removida com sucesso')
        res.redirect('/admin/categorias')
    }).catch((erro) =>{
        req.flash('error_msg', 'Erro ao tentar remover categoria' + erro)
        res.redirect('/admin/categorias')
    })
})


router.get('/postagens', (req, res)=>{
    res.render('admin/postagens')
})

router.get('/postagens/add', (req, res)=>{
    Categoria.find().then((categorias) =>{
        res.render('admin/addpostagem', ({categorias: categorias}))    
    }).catch((erro) =>{
        req.flash('error_msg', 'Houve erro ao carregar o formulario')
        res.redirect('/admin')
    }) 
    
})

router.post('postagens/nova', (req, res) =>{

})


module.exports = router