const express = require('express');
const router = express.Router();
const axios = require('axios')
const path = require('path');

let markedDownDocMap = new Map();
let blogMap = new Map();
let blogsByGroupJson = null


router.get('/blogs/:id', async(req, res) => {
    let blogId = req.params.id
    if(blogMap.has(blogId)) {
        res.end(blogMap.get(blogId))
        console.log("Fetching blog from the cache ....")
    }
    else {
        const blog = await axios.get(`https://lfactorial-strapi-heroku.herokuapp.com/blogs/${req.params.id}`);
        const blogJson = JSON.stringify(blog.data)
        //res.end(JSON.stringify(blog.data));
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
        const allBlogs = await axios.get('https://lfactorial-strapi-heroku.herokuapp.com/blogs');
        const blogsMap = new Map();

        allBlogs.data.forEach(blog => {
            if(!blogsMap.has(blog.category.id )){
                blogsMap.set(blog.category.id, {category: blog.category.name, blogs:[]})
            }
            blogsMap.get(blog.category.id).blogs.push({id: blog.id, tittle: blog.tittle})
        });
        let values = [];
        for (const [key, value] of blogsMap.entries()) {
            values.push(value)
        }
        blogsByGroupJson = JSON.stringify(values)
        res.end(blogsByGroupJson);
    }

})
router.get('/blogsGroupedByCategoryRefreshCache', async(req, res) => {
    const allBlogs = await axios.get('https://lfactorial-strapi-heroku.herokuapp.com/blogs');
    const blogsMap = new Map();

    allBlogs.data.forEach(blog => {
        if(!blogsMap.has(blog.category.id )){
            blogsMap.set(blog.category.id, {category: blog.category.name, blogs:[]})
        }
        blogsMap.get(blog.category.id).blogs.push({id: blog.id, tittle: blog.tittle})
    });
    let values = [];
    for (const [key, value] of blogsMap.entries()) {
        values.push(value)
    }
    blogsByGroupJson = JSON.stringify(values)
    res.end(blogsByGroupJson);
})

router.get('/markedDownDoc/:id', async(req, res) => {
    const docId = req.params.id;
    if(markedDownDocMap.has(docId)) {
        res.end(markedDownDocMap.get(docId));
        console.log("fetching markdown via cache ...")
    }
    else {
        const markedDownDoc = await axios.get(`https://lfactorial-strapi-heroku.herokuapp.com/marked-down-documents/${req.params.id}`);
        const jsonData = JSON.stringify(markedDownDoc.data)
        markedDownDocMap.set(docId, jsonData)
        //res.end(JSON.stringify(markedDownDoc.data)); 
        res.end(jsonData);
    }
})

module.exports = router;

