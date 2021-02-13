import express from "express";
import axios from "axios";
import {
    getValidQuestions,
    mapAnswers,
    StackOverflowAnswer,
    StackOverflowQuestion,
} from "./util";

const app = express();

app.get("/hello", function (_, res) {
    res.json({ greeting: "Hey there, world!" });
});

const baseUrl = "https://api.stackexchange.com";

app.get("/questions", function (_, res) {
    const url = `/2.2/questions?page=1&pagesize=100&order=desc&sort=activity&site=stackoverflow&filter=withbody`;

    axios
        .get<{ items: StackOverflowQuestion[] }>(`${baseUrl}${url}`)
        .then((response) => {
            const questions = getValidQuestions(response.data.items);
            res.json(questions);
        })
        .catch(() => {
            res.status(500).send();
        });
});

app.get("/questions/:id/answers", function (req, res) {
    const url = `/2.2/questions/${req.params.id}/answers?order=desc&sort=activity&site=stackoverflow&filter=withbody`;

    axios
        .get<{ items: StackOverflowAnswer[] }>(`${baseUrl}${url}`)
        .then((response) => {
            const answers = mapAnswers(response.data.items);
            res.json(answers);
        })
        .catch(() => {
            res.status(500).send();
        });
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
