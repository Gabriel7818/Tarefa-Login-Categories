const Categories = require('../models/Categories');

exports.findAll = async (req, res) => {
    await Categories.findAll({
        attributes: ['id','name', 'description'],
        order:[['id','ASC']]
    })
    .then( (categories) => {
        return res.json({
            erro:false,
            categories
        });
    }).catch( (err) => {
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err} ou Nehum Categoria encontrado!!!`
        });
    });
};

exports.findAllPages = async (req, res) => {
    console.log(req.params);

    const {page=1} = req.params;
    const limit = 2;
    let lastPage = 1;

    const countCategories = await Categories.count()
    console.log(countCategories)

    if(countCategories === null) {
        return res.status(400).json({
            erro: true,
            mensagem: "Error: Categorias não encontrada!!!"
        })
    } else {
        lastPage = Math.ceil(countCategories / limit);
        console.log(lastPage);
    }
    // Select id, name, description from Categories Limit 2 offset 3
    // Exemplo:
    // pag 1 = 1,2
    // pag 2 = 3,4
    // pag 3 = 5,6

    await Categories.findAll({
        attributes: ['id','name', 'description'],
        order:[['id','ASC']],
        offset: Number((page * limit) - limit), // pag 3 * 2 = 6
        limit: limit
    })
    .then( (categories) => {
        return res.json({
            erro:false,
            categories,
            countCategories,
            lastPage
        });
    }).catch( (err) => {
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err} ou Nehum Categoria encontrado!!!`
        });
    });
};

exports.findOne = async (req, res) => {
    const { id } = req.params;
    try {
        // await User.findAll({ where: { id: id }})
        const categories = await Categories.findByPk(id);
        if(!categories) {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro Nehum Categoria encontrado!"
            })
        }
        res.status(200).json({
            erro: false,
            categories
        })
    }catch (err){
        res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err}`
        })
    }
};

exports.create = async (req, res) => {
    // const{ name, email, gender, password } = req.body;
    var dados = req.body;
    console.log(dados);
    // dados.password = await bcrypt.hash(dados.password,8);
    // console.log(dados.password);

    await Categories.create(dados)
    .then(()=>{
        return res.json({
            erro: false,
            mensagem:'Categoria cadastrada com sucesso!'
        });
    }).catch((err) => {
        return res.status(400).json({
            erro:true,
            mensagem: `Erro: Categoria não cadastrado...${err}`
        })
    })
};

exports.update = async (req, res) => {
    const{ id} = req.body;

    await Categories.update(req.body,{ where: { id}})
    .then(()=>{
        return res.json({
            erro:false,
            mensagem: "Categoria alterada com sucesso"
        })
    }).catch((err) => {
        return res.status(400).json({
            erro:true,
            mensagem: `Erro: Categoria não alterada ...${err}`
        })
    })
};

exports.delete = async (req, res) => {
    const {id} = req.params;
    await Categories.destroy({where: { id }})
    .then(()=>{
        return res.json({
            erro:false,
            mensagem: "Categoria apagada com sucesso"
        });
    }).catch(() => {
        return res.status(400).json({
            erro:true,
            mensagem: `Erro: ${err} Categoria não apagada...`
        });
    });
};