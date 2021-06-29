const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const axios = require('axios')
const path = require('path');


router.get('/tweets', (req, res) => {
    const str =[{
        "name":"Lfactorial",
        "msg": "Live love laugh",
        "usernaame":"cali-hadraj"
    }];

    res.end(JSON.stringify(str));
});


router.get('/categories', async (req, res) => {
    axios.get('https://lfactorial-strapi.wl.r.appspot.com/cateogories')
    .then(result => {
        res.end(JSON.stringify(result.data))
        console.log(result.data)
    }).catch(error => console.log(error))
});

router.get('/categories/:id', async (req, res) => {
    axios.get(`https://lfactorial-strapi.wl.r.appspot.com/cateogories/${req.params.id}`)
    .then(result => {
        res.end(JSON.stringify(result.data))
        console.log(result.data)
    }).catch(error => console.log(error)) 
});


router.get('/blogsByCategory/:categoryId', async(req, res) => {
    const allBlogs = await axios.get('https://lfactorial-strapi.wl.r.appspot.com/blogs');
    console.log(JSON.stringify(allBlogs.data))
    const categorizedBlogs = allBlogs.data.filter(blog => blog.category.id == req.params.categoryId);
    res.end(JSON.stringify(categorizedBlogs));
});

router.get('/blogs/:id', async(req, res) => {
    const blog = await axios.get(`https://lfactorial-strapi.wl.r.appspot.com/blogs/${req.params.id}`);
    res.end(JSON.stringify(blog.data));
})

router.get('/blogs', async(req, res) => {
    const allBlogs = await axios.get('https://lfactorial-strapi.wl.r.appspot.com/blogs');
    res.end(JSON.stringify(allBlogs.data));
})

router.get('/blogsGroupedByCategory', async(req, res) => {
    const allBlogs = await axios.get('https://lfactorial-strapi.wl.r.appspot.com/blogs');
    const blogsMap = new Map();

    allBlogs.data.forEach(blog => {
        if(!blogsMap.has(blog.category.id )){
            blogsMap.set(blog.category.id, [])
        }
        blogsMap.get(blog.category.id).push(blog)
    });
    let values = [];
    for (const [key, value] of blogsMap.entries()) {
        values.push(value)
      }

    res.end(JSON.stringify(values));

})

router.get('/blogsAndCategory', async(req, res) => {
    const allBlogs = await axios.get('https://lfactorial-strapi.wl.r.appspot.com/blogs');
    const allCategories = await axios.get('https://lfactorial-strapi.wl.r.appspot.com/cateogories')

    const blogsAndCategory= {blogs:allBlogs.data, categories: allCategories.data};

    console.log(blogsAndCategory);
    res.end(JSON.stringify(blogsAndCategory))

})

router.get('/markedDownDoc/:id', async(req, res) => {
    const markedDownDoc = await axios.get(`https://lfactorial-strapi.wl.r.appspot.com/marked-down-documents/${req.params.id}`);
    res.end(JSON.stringify(markedDownDoc.data));
})

module.exports = router;

