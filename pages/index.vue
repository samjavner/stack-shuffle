<template>
    <div class="container">
        <div>
            <h1>Stack Shuffle</h1>
            <ul>
                <li v-for="question in questions" :key="question.id">
                    <h2>{{ question.title }}</h2>
                    <button
                        v-show="!isExpanded[question.id]"
                        @click="toggleQuestion(question.id)"
                    >
                        Show
                    </button>
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
                        <div v-html="question.body" />
                        <div
                            v-for="(answer, index) in answers[question.id]"
                            :key="index"
                        >
                            <button @click="pickAnswer(question.id, index)">
                                Pick Me!
                            </button>
                            <div v-html="answer.body" />
                        </div>
                    </div>
                    <div v-show="isCorrect[question.id]">Yay! You got it!</div>
                    <div v-show="isCorrect[question.id] === false">
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
