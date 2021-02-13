<template>
    <button
        :class="
            'p-2 border-2 rounded text-' +
            color +
            '-800 border-' +
            color +
            '-800 text-' +
            color +
            '-800'
        "
        @click="$emit('click')"
    >
        <slot />
    </button>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.component("Button", {
    props: {
        color: {
            type: String,
            required: true,
        },
    },
});
</script>
