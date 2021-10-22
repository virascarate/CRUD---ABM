const fs = require('fs');
const path = require('path');

/* En la constante "products" ya tienen los productos que están 
guardados en la carpeta Data como Json (un array de objetos literales) */
const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

/* La constante "toThousand" deben enviarla como parametro en el res.render,
les ayudará para mostrar el precio final adecuadamente con 
una cantidad de decimales fija. Es una función, solamente deben poner
como parámetro el precio final (en el archivo ejs): toThousand(finalPrice)*/
const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// (get) Root - Mostrar todos los productos
	index: (req, res) => {
		res.render("products", {
			productsSent: products
		})
	},

	// (get) Detail - Detalle de un producto
	detail: (req, res) => {
		const id = req.params.id;
		const product = products.find(product => {
			return product.id == id
		})

		res.render("detail", {
			productSent: product
		})
	},

	// (get) Create - Formulario para crear
	create: (req, res) => {
		res.render("product-create-form")
	},
	
	// (post) Create - Método para guardar la info
	store: (req, res) => {
		// Guardamos el producto
		//res.send("Nuevo producto creado y guardado!")
	let newProduct = {
		id: products[products.length -1].id + 1, //cuenta la cantidad de objetos dentro del array
		name: req.body.name ,
		price: req.body.price ,
		discount:req.body.discount ,
		category: req.body.category,
		description: req.body.description  ,
		image: req.file.filename
	}
		products.push(newProduct); // agrega nuevo producto al array
		fs.writeFileSync(productsFilePath, JSON.stringify(products, null, " ")); //guarda el producto
		res.redirect('/products/') //redirigue a la vista producto.
	},

	// (get) Update - Formulario para editar
	edit: (req, res) => {
		const id = req.params.id;
		const product = products.find(product => {
			return product.id == id
		})

		res.render("product-edit-form", {
			productSent: product
		})
	},

	
	// (post) Update - Método para actualizar la info
	update: (req, res) => {
		// Editamos el producto que llegó por parametro su ID
		
		let id= req.params.id; //busca el id del producto de la url
		let productToEdit = products.find (product => {
		return	product.id == id;
		}) // esto busca el producto que queremos editar
		
		let editedProduct = {
			id: id,
			name: req.body.name ,
			price: req.body.price ,
			discount:req.body.discount ,
			category: req.body.category,
			description: req.body.description  ,
			image: req.file ? req.file.filename : productToEdit.image // if ternario para que cambie la imagen si es que hay una nueva
		}

		//modificamos el array
		products.forEach ((producto, index) => {
			if (producto.id == id) {
				products[index] = editedProduct;
			}
			
		});


		
		fs.writeFileSync(productsFilePath, JSON.stringify(products, null, " "));
		
		res.redirect('/products/')
	},

	// (delete) Delete - Eliminar un producto de la DB
	destroy: (req, res) => {
		// Eliminamos el producto que llegó por parametro su ID
		
	let id = req.params.id
	let finalProducts = products.filter (product => {
		return product.id != id
	})
	fs.writeFileSync(productsFilePath, JSON.stringify(finalProducts, null, " "));
	res.redirect('/products/')
	},
};

module.exports = controller;