const express = require('express');
const Post=require('../model/Post')
const router = express.Router();
router.get('/', async (req, res) => {
    try{
        const locals={
            title:"NodeJs Blog",
            description:"Simple Blog created with NodeJs, Express & MongoDb."
        }
     let perPage=10;
     let page=req.query.page||1

    const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ])
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec();
     const count= await Post.count();
     const nextPage=parseInt(page)+1;
     const hasNextPage= nextPage <=Math.ceil(count/perPage)


        res.render('index',
        { locals,data,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            currentRoute: '/'});
    }
    catch(error){
        console.log(error);
    }
  
});
// Get Post
router.get('/post/:id', async(req,res)=>{
    try{
 let sulg=req.params.id;
 const data= await Post.findById({_id:sulg})
   res.render('post',{data})
    } catch(e){
      console.log(e);
    }
})
router.get('/about',(req,res)=>{
    res.render('about')
    // res.send("hello ")
})
// Post
router.post('/search', async (req, res) => {
    try {
      const locals = {
        title: "Seach",
        description: "Simple Blog created with NodeJs, Express & MongoDb."
      }
  
      let searchTerm = req.body.searchTerm;
      const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")
  
      const data = await Post.find({
        $or: [
          { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
          { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
        ]
      });
  
      res.render("search", {
        data,
        locals,
      });
  
    } catch (error) {
      console.log(error);
    }
  
  });
module.exports =router
