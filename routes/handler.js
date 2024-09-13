const express = require('express');
const router = express.Router();
const axios = require('axios')
const path = require('path');
require('dotenv').config();


let blogMap = new Map();
let blogsByGroupJson = null
// let blogsByGroupJson = JSON.stringify([
//     {
//         "sports" : 
//         [
//             {
//                 "id":"1",
//                 "tittle":"Test tittle1"
//             },
//             {
//                 "id":"2",
//                 "tittle":"Test tittle2"
//             }
//         ]
//     },
//     {
//         "technical" : 
//         [
//             {
//                 "id":"20",
//                 "tittle":"Technical Test tittle1"
//             },
//             {
//                 "id":"21",
//                 "tittle":"Technical Test tittle2"
//             }
//         ]
//     }
// ]
// )

let staticBlogType = new Set(["me", "ku", "codesnippet"])

let blogsMappedByCategory = new Map();

let blogsCategories = null
// let blogsCategories = JSON.stringify(
//     ["sports","technical","personal"]
// )

 const blogsMap = new Map();
// const blogsMap = new Map([
//     [
//         "sports",   [
//             {
//                 "id":"1",
//                 "tittle":"Test tittle1"
//             },
//             {
//                 "id":"2",
//                 "tittle":"Test tittle2"
//             }
//         ]
//     ],
//     [
//         "technical",   [
//             {
//                 "id":"20",
//                 "tittle":"Technical Test tittle1"
//             },
//             {
//                 "id":"21",
//                 "tittle":"Technical Test tittle2"
//             }
//         ]
//     ],
//     [
//         "personal", []
//     ]
// ]);




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

router.get('/blogCategories', async(req, res) => {
    if(blogsCategories != null) {
        console.log("fetching the blogs category from the cache ... ")
        console.log(blogsCategories)
        res.end(blogsCategories)

    }
    else {
        await refreshBlogCache()
        res.end(blogsCategories)

    }

})

router.get('/blogsByCategory/:category', async(req, res) => {
    if(blogsMap.has(req.params.category)) {
        res.end(JSON.stringify(blogsMap.get(req.params.category).blogs))
    }
    else {
        await refreshBlogCache()
        console.log(blogsMap.get(req.params.category))
        res.end(JSON.stringify(blogsMap.get(req.params.category).blogs))
    }
})
router.get('/clearBlogCache', async(req, res) => {
    blogMap.clear();
    console.log("Blog cache cleared ")
    res.end("Blog cache cleared")
})

router.get('/refreshAllBlogCategories', async(req, res) => {
    await refreshBlogCache()
    console.log("Blog category cache  refreshed ")
    res.end("Blog category cache  refreshed")
})

const refreshBlogCache = async () => {
    const allBlogs = await axios.get(`${process.env.api_domain}/Articles?populate=category`);
    console.log("Inside refresbBlogCache")
    blogsMappedByCategory.clear();
    allBlogs.data.data.forEach(blog => {
        if(!blogsMap.has(blog.attributes.category.data.attributes.name )){
            blogsMap.set(blog.attributes.category.data.attributes.name , {category: blog.attributes.category.data.attributes.name, blogs:[]})
        }
        blogsMap.get(blog.attributes.category.data.attributes.name ).blogs.push({id: blog.id, tittle: blog.attributes.title})
    });
    let values = [];
    let keys = []
    for (const [key, value] of blogsMap.entries()) {
        if(!staticBlogType.has(key)) {
            keys.push(key)
            values.push(value)
        }
    }
    blogsByGroupJson = JSON.stringify(values)
    blogsCategories = JSON.stringify(keys)
}




module.exports = router;

