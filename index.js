const express = require('express')
const axios = require('axios')
var bodyParser = require('body-parser')
const path = require('path');
const { env } = require('process');
const app = express();

//const base_url = "http://localhost:5000";
const base_url = "https://env-5844107.proen.app.ruk-com.cloud"

app.set("views" , path.join(__dirname , "/public/views"))
app.set("view engine" , "ejs")
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended : false}))

app.use(express.static(__dirname + "/public"))



app.get("/products" , async (req,res) => {
    try {

        const response2 = await axios.get(base_url + "/categories")
        const response1 = await axios.get(base_url + "/products")

    res.render("products/viewAll" , { product : response1.data ,categories : response2.data })
    
    } catch(err) {
        res.status(500).send(err)
    }  
})


app.get("/product/:id" , async (req,res) => {
    try {
        const response = await axios.get(base_url + "/products/" + req.params.id)
        
    res.render("products/view" , { product : response.data })
    } catch(err) {
        res.status(500).send(err)
    }
    
})


app.get("/product_create" , async (req,res) => {
    try {
        const categories = await axios.get(base_url + "/categories") 
    res.render("products/create" , {categories : categories.data})
    } catch(err) {
        res.status(500).send(err)
    }    
})


app.post("/product_create" , async (req,res) => {
    try {
        const productdata = {
            product_name : req.body.product_name ,
            category_id : req.body.category_id,
            price : req.body.price}
        await axios.post(base_url + "/products/"  , productdata )
        res.redirect("/products/")
    } catch(err) {
        res.status(500).send(err)
    }
    
})


app.get("/product/update/:id" , async (req,res) => {
    try {         
        const response = await axios.get(base_url + "/products/" + req.params.id)
        const categories = await axios.get(base_url + "/categories") 
        res.render("products/update" ,{ product : response.data ,categories : categories.data })
    } catch(err) {
        res.status(500).send(err)
    }    
})


app.post("/product/update/:id" , async (req,res) => {
    try {
        const productdata = {product_name : req.body.product_name ,
            category_id : req.body.category_id,
            price : req.body.price}
        await axios.put(base_url + "/products/" + req.params.id, productdata )
        res.redirect("/products/")


    } catch(err) {
        res.status(500).send(err)
    }
    
})

app.get("/product/delete/:id" , async (req,res) => {
    try{
        await axios.delete(base_url + "/products/" + req.params.id)
        res.redirect("/products")
    } catch(err){
        res.status(500).send(err)
    }

})

app.get("/users" , async (req,res) => {
    try {
        const response = await axios.get(base_url + "/users")
    res.render("User/usersAll" , { users : response.data })
    } catch(err) {
        res.status(500).send(err)
    }  
})

app.get("/users/:id" , async (req,res) => {
    try {
        const response = await axios.get(base_url + "/users/" + req.params.id)
    res.render("User/user" , { user : response.data })
    } catch(err) {
        res.status(500).send(err)
    }
    
})

app.get("/user_create" , async (req,res) => {
    try {
    res.render("User/create")
    } catch(err) {
        res.status(500).send(err)
    }    
})

app.post("/user_create" , async (req,res) => {
    try {
        const userdata = { fname : req.body.fname ,
            lname : req.body.lname ,
            phone : req.body.phone,
            address : req.body.address}
        await axios.post(base_url + "/users/"  , userdata )
        res.redirect("/users/")
    } catch(err) {
        res.status(500).send(err)
    }
    
})

app.get("/users/update/:id" , async (req,res) => {
    try {         
        const response = await axios.get(base_url + "/users/" + req.params.id)
    res.render("User/update" ,{ users : response.data })
    } catch(err) {
        res.status(500).send(err)
    }    
})

app.post("/users/update/:id" , async (req,res) => {
    try {
        const userdata = { fname : req.body.fname ,
            lname : req.body.lname ,
            phone : req.body.phone,
            address : req.body.address}
        await axios.put(base_url + "/users/" + req.params.id,userdata )
        res.redirect("/users/")


    } catch(err) {
        res.status(500).send(err)
    }
    
})

app.get("/users/delete/:id" , async (req,res) => {
    try{
        await axios.delete(base_url + "/users/" + req.params.id)
        res.redirect("/users")
    } catch(err){
        res.status(500).send(err)
    }

})

app.get("/orders", async (req, res) => {
    try {
       const response1 = await axios.get(base_url + "/orders")
       const resProducts = await axios.get(base_url + "/products")
       const response2 = await axios.get(base_url + "/users")

    
        
        res.render("orders/ordersAll", { 
            orders: response1.data, 
            users: response2.data, 
            products: resProducts.data 
        });
    } catch(err) {
        res.status(500).send(err);
    }
});

app.get("/orders/:id", async (req, res) => {
    try {
        const response = await axios.get(base_url + "/orders/" + req.params.id);
        res.render("orders/orders", { orders: response.data });
    } catch(err) {
        res.status(500).send(err);
    }
});

app.get("/order/create", async (req, res) => {
    try {
    res.render("orders/create");
} catch(err) {
    res.status(500).send(err)
}   
});

app.post('/order/create', async (req, res) => {
    try {

        const productsJSON = req.body.products_id.split(',').map(Number)
        const data = {
            product_id: productsJSON,
            user_id: req.body.user_id
        };
        await axios.post(base_url + '/orders/', data); 
        res.redirect('/orders/');
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get("/orders/update/:id", async (req, res) => {
    try {         
        const response = await axios.get(base_url + "/orders/" + req.params.id);
        res.render("orders/update", { orders: response.data });
    } catch(err) {
        res.status(500).send(err);
    }
});

app.post("/orders/update/:id", async (req, res) => {
    try{
        const data = {order_id: req.body.order_id , product_id: req.body.product_id , user_id: req.body.user_id};
        await axios.put(base_url + '/order/' + req.params.id, data);
        res.redirect("/orders");
    }catch (err){
        console.error(err);
        res.status(500).send('Error');
    }
});

app.get("/orders/delete/:id", async (req, res) => {
    try {
        await axios.delete(base_url + "/orders/" + req.params.id);
        res.redirect("/orders");
    } catch(err) {
        res.status(500).send(err);
    }
});

app.get("/categories", async (req, res) => {
    try {
        const response = await axios.get(base_url + "/categories")
        res.render("categories/categoriesAll", { categories: response.data });
    } catch(err) {
        res.status(500).send(err);
    }
});

app.get("/categories/:id", async (req, res) => {
    try {
        const response = await axios.get(base_url + "/categories/" + req.params.id);
        res.render("categories/categories", { categories: response.data });
    } catch(err) {
        res.status(500).send(err);
    }
});

app.get("/categorie/create", (req, res) => {
    res.render("categories/create");
});

app.post("/categories/create", async (req, res) => {
    try {
        const data = {
            category_id: req.body.categories_id,
            category_name: req.body.categories_name,
        };
        await axios.post(base_url + '/categories/', data); 
        res.redirect('/categories/');
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get("/categories/update/:id", async (req, res) => {
    try {         
        const response = await axios.get(base_url + "/categories/" + req.params.id);
        res.render("categories/update", { categories: response.data });
    } catch(err) {
        res.status(500).send(err);
    }
});

app.post("/categories/update/:id", async (req, res) => {
    try {
        const data = {
            category_name: req.body.category_name,
        };
        await axios.put(base_url + '/categories/' + req.params.id, data); 
        res.redirect('/categories/');
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get("/categories/delete/:id", async (req, res) => {
    try {
        await axios.delete(base_url + "/categories/" + req.params.id);
        res.redirect("/categories");
    } catch(err) {
        res.status(500).send(err);
    }
});


app.listen(5500 , () => {
    console.log("Server start on port 5500")
})