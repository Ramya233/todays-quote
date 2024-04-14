import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import  ejs from "ejs";
import { fileURLToPath } from "url";
import path from "path";
import { dirname, join } from "path";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;
const ApiUrl_Quotes = "https://zenquotes.io/api/random";

app.use(cors());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// app.use(express.static('public'));
app.use(express.static(__dirname + "/public/"));

app.use(bodyParser.urlencoded({ extended: true }));

let todayQuote = "";

async function initialData() {
  try {
    const quoteResult = await axios(ApiUrl_Quotes);
    todayQuote = quoteResult.data[0].q;
  } catch (error) {
    console.log("There was an error: " + error);
  }
}


app.get("/", async (req, res) => {
  if (!todayQuote) {
    await initialData();
  }
  res.render("index.ejs", {
    data: {
      firstQuote: todayQuote,
      responseQuote: "",
    },
  });
});


app.post("/getRandomQuote", async (req, res) => {
  try {
    const result = await axios(ApiUrl_Quotes);
    const responseQuote = result.data[0].q;
    console.log(responseQuote);
    res.render("index.ejs", {
      data: {
        firstQuote: "",
        responseQuote: responseQuote,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});





