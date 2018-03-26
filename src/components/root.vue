<template>
    <!-- 根组件 -->
    <div class="root-container">
        <Layout class="layout">
            <Sider>
                <div>test</div>
            </Sider>
            <Content class="content">
                <transition name="fade" mode="out-in">
                    <router-view></router-view>
                </transition>
            </Content>
        </Layout>
        
    </div>
</template>
<script>
export default {

}
</script>
<style scoped>
.root-container {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
}
.layout {
    width: 100%;
    height: 100%;
}
.content {
    padding: 0 30px;
}
</style>
