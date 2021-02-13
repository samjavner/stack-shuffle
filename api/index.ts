import express from "express";

const app = express();

app.get("/hello", function (_, res) {
    res.send("Hello, world!");
});

export default app;
