<template>
    <div class="container">
        <div class="m-6">
            <h1 class="text-2xl text-blue-700 mb-4">Stack Shuffle</h1>
            <ul>
                <li
                    class="mb-4 p-4 border-gray-500 border-2 border-dashed rounded"
                    v-for="question in questions"
                    :key="question.id"
                >
                    <h2 class="text-lg font-bold mb-4">{{ question.title }}</h2>
                    <Button
                        v-show="!isExpanded[question.id]"
                        color="blue"
                        @click="toggleQuestion(question.id)"
                    >
                        Show Question
                    </Button>
                    <!--
                        If I understand the Stack Exchange API documentation correctly,
                        we can trust the html they are giving us:
                        https://api.stackexchange.com/docs/filters
                    -->
                    <div
                        v-show="
                            isExpanded[question.id] &&
                            isCorrect[question.id] === undefined
                        "
                    >
                        <div class="bg-blue-100 mb-4" v-html="question.body" />
                        <div
                            class="bg-gray-200 my-4"
                            v-for="(answer, index) in answers[question.id]"
                            :key="index"
                        >
                            <Button
                                color="orange"
                                @click="pickAnswer(question.id, index)"
                            >
                                Pick Me!
                            </Button>
                            <div v-html="answer.body" />
                        </div>
                    </div>
                    <div
                        class="text-lg text-green-600"
                        v-show="isCorrect[question.id]"
                    >
                        Yay! You got it!
                    </div>
                    <div
                        class="text-lg text-red-800"
                        v-show="isCorrect[question.id] === false"
                    >
                        Sorry :(
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
import _ from "lodash";
import Vue from "vue";
import { Answer, Question } from "~/model";

export default Vue.extend({
    async asyncData({ $axios }) {
        const isLoaded = true;
        const questions = await $axios.$get<Question[]>("/api/questions");
        const isExpanded = questions.reduce(
            (previous, current) => ({ ...previous, [current.id]: false }),
            {}
        );
        const answers = questions.reduce(
            (previous, current) => ({ ...previous, [current.id]: undefined }),
            {}
        );
        const isCorrect = questions.reduce(
            (previous, current) => ({ ...previous, [current.id]: undefined }),
            {}
        );

        return { isLoaded, questions, isExpanded, answers, isCorrect };
    },
    data() {
        const isLoaded = false;
        const questions: Question[] = [];
        const isExpanded: { [questionId: number]: boolean } = {};
        const answers: { [questionId: number]: Answer[] | undefined } = {};
        const isCorrect: { [questionId: number]: boolean | undefined } = {};

        return {
            isLoaded,
            questions,
            isExpanded,
            answers,
            isCorrect,
        };
    },
    methods: {
        async toggleQuestion(id: number) {
            this.isExpanded[id] = !this.isExpanded[id];

            if (!this.answers[id]) {
                const answers = await this.$axios.$get<Answer[]>(
                    `/api/questions/${id}/answers`
                );
                this.answers[id] = _.shuffle(answers);
            }
        },
        pickAnswer(questionId: number, index: number) {
            const answers = this.answers[questionId];

            if (!answers) {
                return;
            }

            this.isCorrect[questionId] = answers[index]?.isAccepted;
        },
    },
});
</script>

<style>
.container {
    margin: 0 auto;
}
</style>
