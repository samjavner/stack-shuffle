/* eslint-disable camelcase */
import { Answer, Question } from "~/model";

export interface StackOverflowQuestion {
    question_id: number;
    accepted_answer_id: number | undefined;
    answer_count: number;
    body: string;
    title: string;
}

export interface StackOverflowAnswer {
    body: string;
    is_accepted: boolean;
}

export function getValidQuestions(
    questions: StackOverflowQuestion[]
): Question[] {
    return questions
        .filter(
            (question) =>
                question.accepted_answer_id && question.answer_count >= 2
        )
        .map((question) => ({
            id: question.question_id,
            title: question.title,
            body: question.body,
        }));
}

export function mapAnswers(answers: StackOverflowAnswer[]): Answer[] {
    return answers.map((answer) => ({
        body: answer.body,
        isAccepted: answer.is_accepted,
    }));
}
