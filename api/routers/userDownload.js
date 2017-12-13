let express = require('express')
let router = express.Router()
let path = require('path')

router.get('/:id',(req,res,next) => {
    if(req.params.id){
        let id = req.params.id
        let file = path.resolve(__dirname,'../../product/'+id)
        res.download(file)
    }else{
        next()
    }
})
module.exports = router