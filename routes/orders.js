const Order = require('../models/Order.js');
const router = require('express').Router();
const {verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin} = require("./verifytoken.js");


//delete
router.delete('/:id',verifyTokenAndAdmin,async(req,res)=>{
    try{
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Order has been deleted succesfully!");
    }catch(err){
        res.status(500).json(err);
    }
});

// update order video
router.put('/:id',verifyTokenAndAdmin,async(req,res)=>{
   
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id,{$set: req.body},
             {new: true});
        res.status(200).json(updatedOrder)
    } catch (err) {
        res.status(500).json(err)
    }
} 
);
// Add this to your order.js route file
router.get('/last/:userId', verifyTokenAndAuthorization, async(req, res) => {
    try {
        const order = await Order.find({userId: req.params.userId}).sort({createdAt: -1}).limit(1);
        res.status(200).json(order);
    } catch(err) {
        res.status(500).json(err);
    }
});


//get user orders
router.get('/find/:userId',verifyTokenAndAuthorization,async(req,res)=>{
    try{
        const orders = await Order.find({userId: req.params.userId});
        res.status(200).json(orders);
    }catch(err){
        res.status(500).json(err);
    }});

    
//GET ALL orders
//  router.get('/',verifyTokenAndAdmin ,async(req,res)=>{
//     try {
//         const orders = await Order.find();
//         res.status(200).json(orders)
//     }
//         catch (err) {
//             res.status(500).json(err)
//         }
// });


//CREATE Order 
router.post("/", verifyTokenAndAdmin, async(req,res)=>{

    const newOrder = new Order(req.body);

    try{
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder)
    }
    catch(error){
        res.status(500).json(error)
    }
});

// GET MONTHLY INCOME
router.get('/income',verifyTokenAndAdmin ,async(req,res)=>{
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth()-1))
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth()-1))
    
    try{
        const income = await Order.aggregate([
            {$match:{createdAt: {$gte: previousMonth}}},
            {
                $project:{
                    month:{$month: "$createdAt"},
                    sales: "amount",
                },
                    $group:{
                        _id: "$month",
                        total:{$sum:"$sales"}
                    },
            },
        ]);
         res.status(200).json(income);
    }
    catch(err){
        res.status(500).json(err);
    }
})


//create
router.post('/create/new', async(req, res) => {
    const newOrder = new Order(req.body);

    try{
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder)
    }
    catch(error){
        res.status(500).json(error)
    }
});

//Get all order Api with search 

router.get("/", async (req,res)=> {
    const qNew = req.query.new;
    const qId = req.query._id;
    try{
        let order;
        if(qNew){
            order = await Order.find().sort({createdAt: -1}).limit(1);
        }else if(qId){
            order = await Order.find({
                _id:{
                    $in: [qId],
                },
            })
        }else {
            order = Order.find();
        }
        res.status(200).json(order);
    }catch(error){
        res.status(500).json(error);
    }
})

module.exports = router;