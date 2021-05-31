<template>
    <div id="dealership">
        <div id="top"></div>
        <div class="container">
            <img v-for="(item, index) in images" :key="index" :src="item" alt="aaa"/>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            images:[
                require("../assets/dealers/agrofernia.jpg"),
                require("../assets/dealers/bayer.jpg"),
                require("../assets/dealers/compoexpert.jpg"),
                require("../assets/dealers/cosmocel.jpg"),
                require("../assets/dealers/fmc.png"),
                require("../assets/dealers/magnafert.jpg"),
                require("../assets/dealers/syngenta.png"),
            ]
        }
    },
    mounted() {
        console.log(this.list)
    },
}
</script>

<style scoped>

    #dealership{
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

    .container{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        overflow: hidden;
        margin-top: 3vmax;
        padding: 1vmax;
        justify-content: space-around;
    }

    img{
        width: 200px;
        height: 200px;
        object-fit: cover;
        margin: 1vmax;
        border-radius: 50%;
        box-shadow: 0 0.5vmax 1vmax -.2vmax rgb(193, 193, 193);
    }

    @media screen and (max-width:768px) {
    #top{
        height: 12vmax;
    }
    }
</style>