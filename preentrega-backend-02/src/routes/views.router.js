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

router.get("/register", (req, res) => {
    return res.status(200).render("register",{});
});

router.get("/login", (req, res) => {
    return res.status(200).render("login",{});
});




export default router;