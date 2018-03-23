<template>
    <div class="container">
        <Card @click="clickItem">
            <p slot="title">
                {{ title }}
            </p>
            <p>
                {{ content }}
            </p>
        </Card>
    </div>
</template>
<script>
export default {
    props: {
        title: {
            type: String,
            default: ''
        },
        content: {
            type: String,
            default: ''
        }
    },
    data () {
        return {

        }
    },
    methods: {
        clickItem () {
            debugger
        }
    }
}
</script>
<style scoped>
</style>


