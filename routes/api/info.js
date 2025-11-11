let router = require('express').Router();

router.get("/:rno/:sec",async (req,res)=>{
    let { rno ,sec} = req.params;
    console.log(rno,sec);
})
module.exports = router;