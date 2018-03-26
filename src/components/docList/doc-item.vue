<template>
    <div class="container">
        <Card>
            <p slot="title">
                {{ title }}
            </p>
            <p v-if="showPic">
                <img
                    class="doc-pic"
                    :src="`../../../static/img/${docPic}`"
                />
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
        },
        // 显示的文章图片，从static/img取
        docPic: {
            type: String,
            default: ''
        }
    },
    computed: {
        showPic () {
            return this.docPic && this.docPic !== ''
        }
    }
}
</script>
<style scoped>
.container {
    cursor: pointer;
}
.doc-pic {
    max-width: 100%;
    max-height: 200px;
}
</style>


