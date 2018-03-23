<template>
    <!-- 根组件 -->
    <div>
        <transition name="fade" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>
<script>
export default {

}
</script>
