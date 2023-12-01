const Product = require('../models/Product');

module.exports.createProduct = (req, res) => {
    let newProduct = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        image: req.body.image,
        brand: req.body.brand
    });

    return newProduct.save()
    .then((product, error) => {
        if (error) {
            return false;
        } else {
            return res.send(true);
        }
    })
    .catch(err => err);
};

module.exports.getAllProducts = async (req, res) => {
    try {
        let products = await Product.find({});
        res.send(products);
    } catch (error) {
        console.log(error);
    }

};

module.exports.getActiveProducts = async (req, res) => {
    try {
        let products = await Product.find({isActive: true});
        res.send(products);
    } catch (error) {
        console.log(error);
    }

};

module.exports.getProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.productId);

        if (!product) {
            return res.send(false);
        }
        res.send(product);
    } catch (error) {
        res.send('Something went wrong');
    }
};

module.exports.updateProduct = async (req, res) => {
    try {
        let update = {
            name: req.body.name,
            price: req.body.price,
            description: req.body.description
        };

        let product = await Product.findByIdAndUpdate(req.params.productId, update);
        if (!product) {
            return res.json({message: 'Update failed - No product found'});
        }
        res.send(true);

    } catch (error) {
        console.log(error);
        res.send(false);
    }
};

module.exports.archiveProduct = async (req, res) => {
    try {
        let update = { isActive: false };
        let product = await Product.findByIdAndUpdate(req.params.productId, update);
        if (!product) {
            return res.send('Archive failed - No product found');
        }
        res.send(true);
    } catch (error) {
        console.log(error);
        res.send(false);
    }
};

module.exports.activateProduct = async (req, res) => {
    try {
        let update = { isActive: true };

        let product = await Product.findByIdAndUpdate(req.params.productId, update);
        if (!product) {
            return res.send('Activate failed - No product found');
        }
        res.send(true);
    } catch (error) {
        console.log(error);
        res.send(false);
    }
};