const express = require("express")
const app = express();
const cors = require("cors");
const pg = require("pg");
const pool = new pg.Pool();

const s3 = require('./s3.js')


require("dotenv").config();

const { auth, requiredScopes } = require("express-oauth2-jwt-bearer");

app.use(cors())
app.use(express.json())


                            // CHECK JWT TOKEN AND CHECK ALL REQUIRED SCOPES
 
const checkJwt = auth({
    audience: `${process.env.AUDIENCE}`,
    issuerBaseURL: `${process.env.ISSUER_BASE_URL}`,
  });
  
const checkPermissions = requiredScopes("create:brand create:brand delete:brand edit:brand create:product delete:product edit:OrderStatus", { customScopeKey: "permissions"})


                                                    // S3
app.get('/s3url', async (req,res) => {
    const url = await s3.generateUploadURL()
    res.send({url})
})
                                            
                                                    // BRANDS
app.post("/admin/brand", checkJwt, checkPermissions,  async (req, res) => {
    try {
        const {coverTitle} = req.body;
        const {galleryPhoto} = req.body;
        console.log("connected to this url")

        const newBrand = await pool.query("INSERT INTO brand (coverTitle, galleryPhoto) VALUES($1, $2) RETURNING *", [coverTitle, galleryPhoto])
        res.json(newBrand.rows[0])
    } catch (err) {
        console.error(err.message)
    }
})

app.get("/brand", async (req, res) => {
    try {
        const AllBrands = await pool.query("SELECT * FROM brand")
        res.json(AllBrands.rows)
    } catch (err) {
        console.error(err.message)
    }
})

app.delete("/admin/brand/:id", checkJwt, checkPermissions, (req, res) => {
    try {
        const { id } = req.params;
        const deleteBrand = pool.query("DELETE FROM brand WHERE brand_id=$1", [id])

        res.json("post was deleted")
    } catch (err) {
        console.error(err.message)
    }
})

                                                // PRODUCTS
app.post("/admin/product", checkJwt, checkPermissions, async (req, res) => {
    const { brand } = req.body;
    const { title } = req.body;
    const { description } = req.body;
    const { price } = req.body;
    const { quantity } = req.body;
    const { image1 } = req.body;
    const { image2 } = req.body;
    const { image3 } = req.body;
    const { category } = req.body;

    const newProduct =  await pool.query("INSERT INTO product (brand, title, description, price, quantity, image1, image2, image3, category) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)",[brand, title, description, price, quantity, image1, image2, image3, category] )
    res.json(newProduct.rows[0])
})

app.get("/product", async (req, res) => {
    try {
        const allProducts = await pool.query("SELECT * FROM product")
        res.json(allProducts.rows)
    } catch (err) {
        console.error(err.message)
    }
})

app.get("/product/brand/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const allOrders = await pool.query("SELECT * FROM product where brand=$1", [id])
        res.json(allOrders.rows)
    } catch (err) {
        console.error(err)
    }
})

app.get("/product/category/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const allOrders = await pool.query("SELECT * FROM product where category=$1", [id])
        res.json(allOrders.rows)
    } catch (err) {
        console.error(err)
    }
})

app.delete("/admin/product/:id", checkJwt, checkPermissions, (req, res) => {
    try {
        const { id } = req.params;
        const deleteProduct = pool.query("DELETE FROM product WHERE product_id=$1", [id])
        res.json("PRODUCT WAS DELETED")

    } catch (err) {
        console.error(err.message)
    }
})

                                                // Orders
app.post("/customer/order", checkJwt, async (req, res) => { 
    try {
        const { trackingNumber } = req.body;
        const { cart } = req.body;
        const { paymentMethod } = req.body;
        const { grandTotal } = req.body;
        const { createdAtDate } = req.body;
        const { status } = req.body;
        const { firstName } = req.body;
        const { lastName } = req.body;
        const { email } = req.body;
        const { phoneNumber } = req.body;
        const { city } = req.body;
        const { state } = req.body;
        const { postalCode } = req.body;
        const { address } = req.body;

        const newOrder = await pool.query("INSERT INTO orderDetails (trackingNumber, cart, paymentMethod, grandTotal, createdAtDate, status, firstName, lastName, email, phoneNumber, city, state, postalCode, address) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *", [trackingNumber, cart, paymentMethod, grandTotal, createdAtDate, status, firstName, lastName, email, phoneNumber, city, state, postalCode, address])
        res.json(newOrder.rows[0])
    } catch (err) {
        console.error(err)
    }
})

app.get("/customer/order", async (req, res) => {
    try {
        const allOrders = await pool.query("SELECT * FROM orderDetails")
        res.json(allOrders.rows)
    } catch (err) {
        console.error(err)
    }
})

app.get("/customer/order/:id", async (req, res) => {

    const { id } = req.params;
     
    try {
        const allOrders = await pool.query("SELECT * FROM orderDetails where trackingNumber=$1", [id])
        res.json(allOrders.rows)
    } catch (err) {
        console.error(err)
    }
})

app.get("/admin/order/:id", checkJwt, checkPermissions, async (req, res) => {

    const { id } = req.params;
    
    try {
        const allOrders = await pool.query("SELECT * FROM orderDetails where status=$1", [id])
        res.json(allOrders.rows)
    } catch (err) {
        console.error(err)
    }
})

app.delete("/admin/order/:id", checkJwt, checkPermissions, async (req, res) => {

    const { id } = req.params;
    
    try {
        const allOrders = await pool.query("DELETE FROM orderDetails where trackingNumber=$1", [id])
        res.json(allOrders.rows)
    } catch (err) {
        console.error(err)
    }
})

app.put("/admin/order/:id", checkJwt, checkPermissions, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updateStatus = await pool.query("UPDATE orderDetails SET status = $1 WHERE trackingNumber = $2", [ status, id ])
        res.json("Status was updated")
    } catch (err) {
        console.error(err)
    }
})

app.put("/customer/order/:id", checkJwt, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updateStatus = await pool.query("UPDATE orderDetails SET status = $1 WHERE trackingNumber = $2", [ status, id ])
        res.json("Status was updated")
    } catch (err) {
        console.error(err)
    }
})

app.listen(process.env.PORT, () => console.log("server listening on port " + process.env.PORT))