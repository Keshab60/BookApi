const mongoose = require("mongoose");
require("dotenv").config();
const Book = require("./modules/bookSchema"); // adjust path if needed

mongoose.connect(process.env.DB_URL)
    .then(() => console.log("MongoDB Connected for Seeding"))
    .catch(err => console.error(err));

const books = [
    { name: "Node Basics", description: "Intro to Node.js runtime", author: "Keshab", publishDate: "2022-01-10" },
    { name: "Mongo Mastery", description: "Complete MongoDB guide", author: "Ravi", publishDate: "2023-03-15" },
    { name: "Express Guide", description: "Routing and middleware explained", author: "Anita", publishDate: "2021-07-22" },
    { name: "JavaScript Deep Dive", description: "Advanced JS concepts", author: "Keshab", publishDate: "2020-11-11" },
    { name: "Backend Engineering", description: "Scalable backend systems", author: "Rohit", publishDate: "2024-02-01" },
    { name: "Clean Code", description: "Writing readable code", author: "Robert", publishDate: "2019-05-05" },
    { name: "API Design", description: "RESTful API best practices", author: "Anita", publishDate: "2023-09-09" },
    { name: "Data Structures", description: "Core CS foundations", author: "Ravi", publishDate: "2018-06-30" },
    { name: "System Design", description: "Design large systems", author: "Keshab", publishDate: "2024-01-20" },
    { name: "TypeScript Handbook", description: "Static typing for JS", author: "Rohit", publishDate: "2022-08-18" },
    { name: "Algorithms 101", description: "Basic algorithms explained", author: "Anita", publishDate: "2017-12-12" },
    { name: "Docker Essentials", description: "Container basics", author: "Ravi", publishDate: "2021-04-14" },
    { name: "Kubernetes Intro", description: "Orchestration fundamentals", author: "Robert", publishDate: "2023-10-10" },
    { name: "Microservices", description: "Service architecture patterns", author: "Rohit", publishDate: "2020-02-02" },
    { name: "Testing Node Apps", description: "Unit and integration testing", author: "Keshab", publishDate: "2024-06-06" }
];

async function seedDB() {
    try {
        await Book.deleteMany(); // optional: clears old data
        await Book.insertMany(books);
        console.log("Seeding Successful");
        process.exit();//stops the node.js program and we can say it will close the db connection
    } catch (error) {
        console.error("Seeding Error:", error);
        process.exit();//it will catch the error
    }
}

seedDB();
