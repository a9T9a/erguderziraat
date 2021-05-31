<template>
    <div id="about">
        <div id="top"></div>
    </div>
</template>

<script>
export default {
    
}
</script>

<style scoped>
    #about{
        width: 100%;
        min-height: 70vh;
        height: 100%;
        display: flex;
        flex-direction: row;
        background-color:rgb(240, 250, 240);    
        padding-bottom: 4vmax;        
    }
    #top {
        position: absolute;
        left: 0;
        top: 0;
        margin: 0;
        padding: 0;
        width: 100%;
        height: 8vmax;
        background-image: linear-gradient(rgba(57, 164, 75, .8), rgb(240, 250, 240));
        z-index: -1;
    }

@media screen and (max-width:768px) {
    #top{
        height: 12vmax;
    }
}
</style>