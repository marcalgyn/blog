

if (process.env.NODE_ENV == "production") {
    module.exports = {mongoURI: "mongodb+srv://marcalgyn:a1a2a3a4@blogapp-w3yyi.mongodb.net/test?retryWrites=true&w=majority"}
} else {
    module.exports = {mongoURI: "mongodb://localhost/blogapp"}
}