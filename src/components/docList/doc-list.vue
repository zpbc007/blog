<template>
    <div class="container">
        <doc-item 
            class="item"
            v-for="item in docList" 
            :key="item.id"
            :title="item.title"
            :content="item.content"
            @click.native="itemClick(item.id)"
        ></doc-item>
    </div>
</template>
<script>
import axios from 'axios'

const fetchUrl = {
    docList: '/api',
}

export default {
    data () {
        return {
            // 文章列表数据
            docList: []
        }
    },
    mounted () {
        this.getDoc()
    },
    methods: {
        getDoc () {
            axios.get(fetchUrl.docList)
                .then(res => {
                    this.docList = res.data
                })
                .catch(error => {
                    this.$Message.error('获取数据失败')
                })
        },
        itemClick (id) {
            this.$router.push({
                name: 'viewPage',
                params: {id}
            })
        }
    }
}
</script>
<style scoped>
.item {
    margin-bottom: 20px;
    border: 1px, solid 
}
</style>

