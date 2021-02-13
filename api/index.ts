import express from "express";

const app = express();

app.get("/hello", function (_, res) {
    res.json({ greeting: "Hey there, world!" });
});

export default app;
