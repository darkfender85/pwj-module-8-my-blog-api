const PATH = './data.json';
const fs = require('fs');

class Post {

    get() {
        // Get Posts
        return this.readData();
    }

    getIndividualBlog(postId) {
        // Get one blog post
        const currentPosts = this.readData();
        const blogPost= currentPosts.find((item) => item.id === postId);

        return blogPost;
    }

    add(newPost) {
        // Add a new post
        const currentPosts = this.readData();
        currentPosts.unshift(newPost);
        this.storeData(currentPosts);
    }

    readData() {
        let rawData = fs.readFileSync(PATH);
        let data = JSON.parse(rawData);

        return data;
    }

    storeData(rawData)  {
        let data = JSON.stringify(rawData);
        fs.writeFileSync(PATH,data)
    }

}

module.exports = Post;