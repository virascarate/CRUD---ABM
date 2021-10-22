// ************ Require's ************
const express = require('express');
const router = express.Router();
const multer = require ('multer');

// ************ Controller Require ************
const productsController = require('../controllers/productsController');

// ************ Configuracion de multer ************

const storage = multer.diskStorage({
    destination: function (req, file, cb){
cb (null, './public/images/products') //ruta donde se guarda
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname) //nombre que va a tener el archivo
    }

})
const upload = multer({storage});

// Devolver todos los productos  
router.get('/', productsController.index);


// Crear un producto
router.get('/create/', productsController.create);

// Devolver un producto 
router.get('/:id/', productsController.detail);
router.post('/', upload.single("newProductImage"), productsController.store);

// Editar un producto 
router.get('/edit/:id/', productsController.edit); 
router.put('/edit/:id/', upload.single("editedProductImage"), productsController.update); 

// Eliminar un producto 
router.delete('/delete/:id', productsController.destroy);


module.exports = router;