const express = require('express');
const router = express.Router();
const axios = require('axios')
const path = require('path');
require('dotenv').config();


let blogMap = new Map();
let blogsByGroupJson = null
let staticBlogType = new Set(["me", "ku", "codesnippet"])



router.get('/blogs/:id', async(req, res) => {
    let blogId = req.params.id
    console.log(process.env.api_domain)
    if(blogMap.has(blogId)) {
        res.end(blogMap.get(blogId))
        console.log("Fetching blog from the cache ....")
    }
    else {
        const blog = await axios.get(`${process.env.api_domain}/Articles/${req.params.id}?populate=blocks`);
        const blogJson = JSON.stringify(blog.data)
        blogMap.set(blogId, blogJson)
        res.end(blogJson)
    }
})



router.get('/blogsGroupedByCategory', async(req, res) => {
    if(blogsByGroupJson != null) {
        res.end(blogsByGroupJson)
        console.log("fetching the blogs category from the cache ... ")
    }
    else{
        const allBlogs = await axios.get(`${process.env.api_domain}/Articles?populate=category`);
        const blogsMap = new Map();

        allBlogs.data.data.forEach(blog => {
            if(!blogsMap.has(blog.attributes.category.data.attributes.name )){
                blogsMap.set(blog.attributes.category.data.attributes.name , {category: blog.attributes.category.data.attributes.name, blogs:[]})
            }
            blogsMap.get(blog.attributes.category.data.attributes.name ).blogs.push({id: blog.id, tittle: blog.attributes.title})
        });
        let values = [];
        for (const [key, value] of blogsMap.entries()) {
            if(!staticBlogType.has(key)) {
                values.push(value)
            }
        }
        blogsByGroupJson = JSON.stringify(values)
        res.end(blogsByGroupJson);
    }

})
router.get('/blogsGroupedByCategoryRefreshCache', async(req, res) => {
    const allBlogs = await axios.get(`${process.env.api_domain}/Articles?populate=category`);
    const blogsMap = new Map();

    allBlogs.data.data.forEach(blog => {
        if(!blogsMap.has(blog.attributes.category.data.attributes.name )){
            blogsMap.set(blog.attributes.category.data.attributes.name , {category: blog.attributes.category.data.attributes.name, blogs:[]})
        }
        blogsMap.get(blog.attributes.category.data.attributes.name ).blogs.push({id: blog.id, tittle: blog.attributes.title})
    });
    let values = [];
    for (const [key, value] of blogsMap.entries()) {
        if(!staticBlogType.has(key)) {
            values.push(value)
        }
    }
    blogsByGroupJson = JSON.stringify(values)
    res.end(blogsByGroupJson);
})



module.exports = router;

