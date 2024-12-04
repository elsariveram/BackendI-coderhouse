import express from 'express'

const router = express.Router()

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/realtimeproducts", (req, res) => {
    res.render("realtimeproducts");
});


export default router;