import {
    getValidQuestions,
    mapAnswers,
    StackOverflowAnswer,
    StackOverflowQuestion,
} from "./util";
import { Answer, Question } from "~/model";

describe("getValidQuestions", () => {
    const question3: StackOverflowQuestion = {
        accepted_answer_id: 42,
        answer_count: 2,
        question_id: 3,
        title: "This is question.",
        body: "Give me help, please!",
    };

    const question4: StackOverflowQuestion = {
        accepted_answer_id: 99,
        answer_count: 3,
        question_id: 4,
        title: "I have another question.",
        body: "I really need the answer!",
    };

    const noAcceptedAnswer: StackOverflowQuestion = {
        accepted_answer_id: undefined,
        answer_count: 3,
        question_id: 5,
        title: "This is hard question.",
        body: "It's tough, but you can try.",
    };

    const oneAnswerAccepted: StackOverflowQuestion = {
        accepted_answer_id: 142,
        answer_count: 1,
        question_id: 6,
        title: "I'm bad at math",
        body: "What is 1 + 1?",
    };

    it("should map questions to our model", () => {
        const actual = getValidQuestions([question3, question4]);

        const expected: Question[] = [
            {
                id: 3,
                title: "This is question.",
                body: "Give me help, please!",
            },
            {
                id: 4,
                title: "I have another question.",
                body: "I really need the answer!",
            },
        ];

        expect(actual).toEqual(expected);
    });

    it("should only return questions with an accepted answer", () => {
        const actual = getValidQuestions([
            question3,
            noAcceptedAnswer,
            question4,
        ]);

        const expectedIds = [3, 4];

        expect(actual.map((question) => question.id)).toEqual(expectedIds);
    });

    it("should only return questions with multiple answers", () => {
        const actual = getValidQuestions([
            question3,
            oneAnswerAccepted,
            question4,
        ]);

        const expectedIds = [3, 4];

        expect(actual.map((question) => question.id)).toEqual(expectedIds);
    });
});

describe("mapAnswers", () => {
    it("should map answers to our model", () => {
        const answers: StackOverflowAnswer[] = [
            {
                body: "Answer 1",
                is_accepted: false,
            },
            {
                body: "Answer 3",
                is_accepted: true,
            },
        ];

        const actual = mapAnswers(answers);

        const expected: Answer[] = [
            {
                body: "Answer 1",
                isAccepted: false,
            },
            {
                body: "Answer 3",
                isAccepted: true,
            },
        ];

        expect(actual).toEqual(expected);
    });
});
