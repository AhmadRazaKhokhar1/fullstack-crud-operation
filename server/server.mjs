import express from 'express';
import cors from 'cors';
import mongoose, { mongo } from 'mongoose'
import dotenv from 'dotenv';
import axios from 'axios'
dotenv.config()

//connecting to DB
mongoose.connect('mongodb+srv://ahmadrazakhokhar:ahmadraza786@cluster0.ylryeuq.mongodb.net/test?retryWrites=true&w=majority');

const productSchema =  new mongoose.Schema({
    productName:String,
    productPrice:Number,
    currencyCode:String,
    numberOfSale:Number,
    isFreeShipping:Boolean,
    shopName:String,
    rating:Number,
    createdOn:{
        type:Date, default: Date.now
    }
});
const productModel = new mongoose.model('Product', productSchema)
const app = express();
app.use(express.json());
app.use(cors());

//post the product
app.post('/post', async(req, res)=>{
    const productData = new productModel({
        productName: req.body.productName,
        productPrice:req.body.productPrice,
        currencyCode:req.body.currencyCode,
        numberOfSale:req.body.numberOfSale,
        rating:req.body.rating,
        isFreeShipping:req.body.isFreeShipping,
        shopName:req.body.shopName,
    });
    const result = await productData.save();
    res.status(200).send({ message: "Successfully Added the Product!", result});
});

//get all the products
app.get('/data', async (req, res)=>{
    
   const response = await productModel.find({}).exec();

    res.status(200).send({
        message:"The data has been fetched successfully!",
        data: response,
    })
});

//getting product by it id
app.get('/product/:id', async(req, res)=>{
    const result = await productModel.findOne({_id:req.params.id});
    res.status(200).send({result})
})

//deleting product by its id
app.delete('/product/:id', async(req, res)=>{
    const deletedProduct = await productModel.findByIdAndDelete({_id:req.params.id});
    res.status(200).send({
        message:"Product deleted successfully!",
        deletedProduct
    })
})

//updating product by its id
app.put('/product/:id', async(req, res)=>{
    let body = req.body
    const updatedProduct = await productModel.findByIdAndUpdate({_id: req.params.id}, {$set: body}, {new:true});
    res.status(200).send({
        message:'Product updated successfully!',
        updatedProduct
    })
})


//listening to the server
app.listen(8000, ()=>{
    console.log(`server is live at 8000`);
})

