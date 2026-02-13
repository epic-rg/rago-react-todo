import express from "express";

const PORT = process.env.PORT || 8000;
const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.send({ msg: "App is working!" });
});

app.listen(PORT, () => console.log(`App running on PORT: ${PORT}`));
