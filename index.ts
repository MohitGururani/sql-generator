import express, { Application, Request, Response } from "express";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";
import * as dotenv from "dotenv"
dotenv.config()
const PORT: number = 8000;

const app: Application = express();

// Configure CORS to allow requests from localhost:3000
const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
app.use(express.json());

const API_KEY = process.env.API_KEY

const configuration = new Configuration({
  apiKey: API_KEY,
});

const openai = new OpenAIApi(configuration);

// Correct the route definition by adding a forward slash before "completions"
app.post("/completions", async (req: Request, res: Response) => {
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: "Create a SQL request to" + req.body.message,
        },
      ],
    });
    res.send(completion.data.choices[0].message);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

app.listen(PORT, () => console.log(`Your server is running on PORT ${PORT}`));
