<template>
    <div v-html="innerHtml">
    </div>
</template>
<script>

import axios from 'axios'

export default {
    props: {
        id: {
            type: String,
            required: true
        }
    },
    data () {
        return {
             innerHtml: '暂无数据'
        }
    },
    methods: {
        getDoc () {
            axios.get(`/api/view/${this.id}`)
                .then(res => {
                    this.innerHtml = res.data
                })
        }
    },
    mounted () {
        this.getDoc()
    }
}
</script>
<style scoped>

</style>

