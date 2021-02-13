import express from "express";

const app = express();

app.get("/hello", function (_, res) {
    res.json({ greeting: "Hey there, world!" });
});

export default app;

// Start standalone server if directly running
if (require.main === module) {
    const port = process.env.PORT || 3001;
    app.listen(port, () => {
        // eslint-disable-next-line no-console
        console.log(`API server listening on port ${port}`);
    });
}
