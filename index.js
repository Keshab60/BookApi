const express = require("express")
const book = require("./modules/bookSchema")
require("dotenv").config()
const app = express();
app.use(express.json())

app.post("/storebook", async (req, res) => {
    try {
        const { name, description, author, publishDate } = req.body
        if (!name || !author || !description) {
            return res.json({ message: "name, description, and author are required" })
        }
        const storedbook = await book.create({ name, description, author, publishDate })
        res.json(storedbook)
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

app.get("/books", async (req, res) => {
    try {
        // Extract query parameters
        const { searchTerm, author, from, to, page = 1, limit = 10, sortBy = "name", order = "asc" } = req.query;

        //  Build the query object
        let query = {};

        // Text search on name & description
        if (searchTerm) {
            query.$text = { $search: searchTerm };
        }

        // Author filter (case-insensitive exact match)
        if (author) {
            query.author = new RegExp(`^${author}$`, "i"); // ^ and $ ensures exact match
        }/* we use this new regex method to convert `^${author}$`, "i"  to this /^Keshab$/i  and later on the name is stored inside the query object like this
         {
          author: /^Keshab$/i
         }*/
        //when we do db.find(query) query object also conatins this author: /^Keshab$/i so /^Keshab$/i meaaning keshab is the author name and i means case insensitive and now find a document which include this name 

        
        // Publish date range filter
        if (from || to) {
            query.publishDate = {};
            if (from) query.publishDate.$gte = new Date(from);
            if (to) query.publishDate.$lte = new Date(to);
        }// it will become like this
        //  const query={
        //        publishDate: {
        //            $gte: new Date("2026-01-01T00:00:00.000Z"),
        //            $lte: new Date("2026-01-31T00:00:00.000Z")
        //          }
        //  }
        //and when we do db.find(query),publishdate is stored inside the query object so indirectly mongodb        searches like this
        //  db.books.find({
        //         publishDate: {
        //           $gte: new Date("2026-01-01T00:00:00.000Z"),
        //           $lte: new Date("2026-01-31T00:00:00.000Z")
        //         }
        //   });  and this query searches inside the collection where the publishdate is present and the time lies between this range  

        //  Handle pagination
        const pageNumber = parseInt(page) || 1;
        let limitNumber = parseInt(limit) || 10;
        limitNumber = limitNumber > 50 ? 50 : limitNumber; // max limit 50
        const skip = (pageNumber - 1) * limitNumber;

        //  Handle sorting
        const sortOrder = order === "desc" ? -1 : 1;
        const allowedSortFields = ["name", "author", "publishDate"];
        const sortField = allowedSortFields.includes(sortBy) ? sortBy : "name";
        const sortObj = { [sortField]: sortOrder };

        //  Execute query
        const books = await book
            .find(query)
            .sort(sortObj)
            .skip(skip)
            .limit(limitNumber);
            
        const totalBooks = await book.countDocuments(query);
        //  Send response
        res.json({
            page: pageNumber,
            limit: limitNumber,
            total: totalBooks,
            books
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


app.listen(process.env.PORT, () => console.log(`server running on port ${process.env.PORT}`))





