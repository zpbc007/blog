<template>
    <div class="markdown-style" v-append="innerHtml">
    </div>
</template>
<script>
import axios from 'axios'
import '../../static/css/code.css'
import '../../static/css/markdown.css'

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

