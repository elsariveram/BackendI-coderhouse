import express from 'express'

const router = express.Router()

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/realtimeproducts", (req, res) => {
    res.render("realtimeproducts");
});

router.get("/products", (req, res) => {
    res.render("productos");
});

router.get("/carts/:cid", (req, res) => {
    res.render("carritos");
});

export default router;