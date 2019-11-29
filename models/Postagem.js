const mongoose = require('mongoose')
const Schemma = mongoose.Schema

const Postagem = new Schemma({

    titulo: {
        type: String,
        require: true
    },
    slug: {
        type: String,
        require: true
    },
    descricao: {
        type: String,
        require: true
    },
    conteudo: {
        type: String,
        require: true
    },
    categoria: {
        type: Schemma.Types.ObjectId,
        ref: 'categorias',
        require: true
    },
    data: {
        type: Date,
        default: Date.now()
    }

})

mongoose.model('postagens', Postagem)