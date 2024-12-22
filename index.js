import express from "express";
import axios from "axios";
import bodyParser from "body-parser";


const app = express();
const port = 3000;
const URL = "https://v2.jokeapi.dev/joke/";

//Categories
const categories = ["Programming", "Dark", "Spooky", "Christmas"];
const languages = ["English", "French", "German"];

//Using public folder for static files
app.use(express.static("public"));

//Using bodyParser middleware
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.render("index.ejs", { content: "Waiting for data"});
});

app.post("/post-joke", async (req, res) => {
    console.log(req.body);

    const selectedCategories = Array.isArray(req.body.categories) ? req.body.categories.join(",") : "Any";
    const language = req.body.language || "en";
    const blacklistFlags = Array.isArray(req.body.blacklist) 
    ? req.body.blacklist.filter(flag => flag !== "on").join(",") : "";

    const API_URL = `${URL}${selectedCategories}?lang=${language}&blacklistFlags=${blacklistFlags}`;

    try {
        const response = await axios.get(API_URL);
        const result = response.data;

        res.render("index.ejs", { content: result.joke || `${result.setup} - ${result.delivery}`});

        console.log(API_URL);
    }
    catch (error) {
        res.render("index.ejs", { content: "Error fetching joke: " + error.message });
        console.log(API_URL);
    };
});

//Server listening on predefined port
app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});

