const { request, response } = require('express');
const express = require('express');
const app = express();
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, `${file.fieldname}-${Date.now()}.${getImageExtension(file.mimetype)}`)
    }
})

const getImageExtension = (mimeType) => {
    switch(mimeType){
        case "image/png":
            return 'png';
        case "image/jpeg":
            return 'jpeg';
        case "image/jpg":
            return 'jpg';
    }
};

var uploads = multer({dest:'uploads/',storage:storage});

const Posts = require('./api/models/posts');
const postsData = new Posts();

app.use(express.json())



app.use( (req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    next();
});

app.use('/uploads', express.static('uploads'));

app.get('/api/posts', (request, response) => {
    response.status(200).send(postsData.get());
})

app.get('/api/posts/:post_id', (request,response) => {
    const id = request.params.post_id;
    const post = postsData.getIndividualBlog(id);
    if(post){
        response.status(200).send(post);
    }
    else{
        response.status(404).send({
            error:'No post found!'
        })
    }
}) 

app.post('/api/posts', uploads.single('post-image'), (request,response) => {
    let json = request.body;
    const newPost = Object.assign({},json,{
        "id": `${Date.now()}`,
        "post_image": request.file.path,
        "added_date": `${Date.now()}`
    })

    postsData.add(newPost);
    response.status(200).send(newPost);
    
})

app.listen(3000, () => console.log('Listening on http://localhost:3000'))