<template>
    <div class="list">
        <div id="top"></div>
        <div id="nav" class="nav" v-show="nav">
            <p @click="filter(null)">Tümü</p>
            <hr class="hr">
            <div>
                <p v-for="(item,index) in filters.categories" :key="index" @click="filter(item.title)">{{item.title}}</p>
            </div>
            <hr class="hr">
            <div>
                <p class="sub" v-if="subCategories.length>0" @click="subFilter(null)"><strong>Tümü</strong></p>
                <p class="sub" v-for="(item,indx) in subCategories" :key="indx" @click="subFilter(item)" >{{item}}</p>
            </div>
        </div>
        <div v-if="navbutton" id="navbutton" class="nav-button" @click="nav=!nav">
            <p>Filtreler</p>
        </div>
        <div v-if="nav&&navbutton" id="exit" class="nav-button" @click="slide()">
            <p>X</p>
        </div>
        <div class="container">
            <div class="card" v-for="(product,index) in getProducts" :key="index">
                <div class="card-image">
                    <img :src="product.imageURL"/>
                </div>
                <div class="card-info">
                    <div class="card-name">{{product.name}}</div>
                    <div class="card-category">
                        <p class="category" :style="{'margin-inline':'0.5vmax'}">{{product.subCategory}}</p>
                    </div>
                    <button class="detail-button" @click="show(product.id),dialog=true">Detay</button>
                </div>
            </div>
        </div>
        <transition name="fade">
            <detail-dialog :item="product" v-if="dialog"/>
        </transition>
    </div>
</template>

<script>
import { mapGetters } from "vuex"
import DetailDialog from "./DetailDialog"

export default {
    
    components:{
        DetailDialog
    },

    data(){
        return{
            navbutton:false,
            nav:false,
            
            dialog:false,

            filters:{
                categories:[],
                brands:[]
            },

            subCategories:[],
            product:[],
        }
    },

    created(){

        if(window.innerWidth<768){
            this.navbutton=true
            this.nav=false
        }else{
            this.navbutton=false
            this.nav=true
        }

        window.addEventListener("resize",this.resize)
    },

    beforeDestroy(){
        
        window.removeEventListener("resize",this.resize)
    },

    mounted(){
        this.filters=this.getFilters
    },

    methods:{

        slide(){
            if(this.nav){
                let navi = document.getElementById("nav")
                let lft = navi.clientWidth
                let strt = 0
                let opa = 1

                let intrvl = setInterval(()=>{
                    navi.style.left="-"+strt+"px"
                    document.getElementById("exit").style.opacity=opa
                    strt=strt+5
                    opa=opa-0.1

                    if(strt>=lft){
                        clearInterval(intrvl)
                        this.nav=false
                        document.getElementById("navbutton").style.display = "flex"
                    }
                },2)
            }
        },

        resize(){
            if(window.innerWidth<768){
                this.navbutton=true
                this.nav=false
            }else{
                this.navbutton=false
                this.nav=true
            }
        },
        
        show(id){
            this.product=this.$store.getters.getProducts.find(product=>product.id==id)
        },

        filter(value){
            this.$store.commit("setCatFilter",value)
            this.$store.commit("setSubFilter",null)
            if(value!=null){
                this.subCategories=this.filters.categories.find(cat=>cat.title==value).sub
            }
            
            setTimeout(()=>{  
                let wdth = document.getElementById("nav").clientWidth
                document.getElementById("exit").style.left=wdth+"px"
            },10)
        },

        subFilter(value){
            this.$store.commit("setSubFilter",value)
        },
    },

    computed:{
        ...mapGetters(["getProducts","getFilters"]),
    },

    watch:{
        nav: (val)=>{
            if(window.innerWidth<768){
                if(val){
                    document.getElementById("navbutton").style.display="none"
                    setTimeout(()=>{
                        document.getElementById("exit").style.left = document.getElementById("nav").clientWidth+"px"
                        document.getElementById("exit").style.height = "5vmax"
                        document.getElementById("nav").style.left = 0               
                    },1000)
                }else{
                    document.getElementById("navbutton").style.display="flex"
                }
            }
        }
    }
}
</script>

<style scoped>

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

    .list{
        width: 100%;
        min-height: 70vh;
        height: 100%;
        display: flex;
        flex-direction: row;
        background-color:rgb(240, 250, 240);    
        padding-bottom: 4vmax;        
    }

    .nav{
        width: 13%;
        height: 75vh;
        margin-top: 3vmax;
        padding-top: 0.5vmax ;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: left;
        color: #2c3e50;
        font-size: 1vmax;
        /*background-color: rgba(230, 150, 70, .55);*/
        background-color: rgba(57, 164, 75, .2);
        box-shadow: 0.5vmax 0.5vmax 1vmax -0.4vmax rgb(120, 120, 120);
        overflow: auto;
        scrollbar-width:thin;
        text-align: left;
    }

    .nav p{
        padding-left: 1vmax ;
        cursor: pointer;
    }

    .nav p:hover{
        transition: .5s ease-out;
        transform: translateX(10px);
    }

    .hr{
        width: 90%;
        display: flex;
        justify-content: flex-start;
    }

    .sub{
        font-size: 0.8vmax;
        font-weight: 400;
    }

    .nav-button{
        position: absolute;
        top: 16%;
        left:0;
        height: 20%;
        width: 5%;
        font-size: 2.2vmax;
        background-color:rgba(226, 134, 69);
        opacity: 0.95;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0 1vmax 1vmax 0;
        z-index: 2;
        animation: leftright ease-out .5s;
        cursor: pointer;
    }

    .nav-button p{
        transform: rotate(-90deg);  
    }

    .container{
        width: 87%;
        height: 100%;
        min-height:100% ;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        margin-top: 2vmax;
    }

    .card{
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        position: relative;
        box-sizing: border-box;
        height: 18vmax;
        width: 11vmax;
        background-color:rgb(240, 250, 240);
        color: #2c3e50;
        border-radius: 0.3vmax;
        /*border: 1px solid rgb(200, 200, 200);*/
        box-shadow: 0vmax 0.3vmax 1.5vmax -0.6vmax rgb(100, 100, 100);
        margin: 1vmax;
        display: flex;
        flex-direction: column;
        justify-content:flex-start;
        align-items: center;
        padding: 0.5vmax;
    }

    .card-image{
        position: relative;
        width: 10vmax;
        height: 10vmax;
        object-fit: cover;
        margin-bottom: 0.5vmax;
        border-radius: 1vmax;
        border: 1px solid rgb(210, 210, 210);
        box-shadow: 0vmax 0.3vmax 1.2vmax -0.6vmax rgb(80, 80, 80);
    }

    .card-image img{
        height: 100%;
        width: 100%;
        border-radius: 1vmax;
    }

    .card-info{
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-size: 1vmax;
        font-family: Arial, Helvetica, sans-serif;
        font-weight: 500;
    }

    .card-name{
        max-height: fit-content;
        align-self: center;
        width: 100%;
        min-width: 50%;
        font-size: 1vmax;
        font-weight: 800;
        /*margin-bottom:.5vmax;*/
        padding: 0.1vmax;
        border-radius: 0.5vmax;
        text-shadow: 0vmax 0.05vmax 0.1vmax rgb(140, 140, 140);
        /*border:1px solid rgb(220, 200, 190);
        box-shadow: 0 0.3vmax 1.2vmax rgb(220, 200, 190);*/

        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }

    .card-category{
        max-height: 2vmax;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        font-size: .8vmax;
        font-weight: 500;
        color: grey;
    }

    .detail-button{
        font-size: 0.9vmax;
        padding: 0.2vmax;
        font-weight: 600;
        color: #2c3e50;
        border-radius: .6vmax;
        border: 1px solid rgb(200, 200, 200);
        width: 50%;
        align-self: center;
        box-shadow: 0vmax 0.3vmax 1.2vmax -0.6vmax rgb(80, 80, 80);
        background-color:lightblue;
        cursor:pointer;
        outline: none;
        transition: ease-in-out 0.1s;
    }
    .detail-button:hover{
        box-shadow: 0vmax 0vmax 0vmax
    }

    .fade-enter-active {
        animation: move .5s linear;
    }
    .fade-leave-active{
        animation: move .5s reverse;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
        transform: scale(0);
    }

    @keyframes move{
        from{
            transform: scale(0);
        }
        to{
            transform:scale(1)
        }
    }



@media screen and (max-width:768px) {
    #top{
        height: 12vmax;
    }

    .card{
        height: 37vmax;
        width: 22vmax;
        margin: 2vmax;
        padding: 0.5vmax;
    }
    .card-info{
        margin: 0.5vmax;
    }

    .card-image{
        width: 20.5vmax;
        height: 20.5vmax;
        margin-bottom:0.5vmax;
    }

    .card-name{
        font-size: 2vmax;
        padding: 0;
        margin-top: 1vmax;
        height: fit-content;
    }

    .card-category{
        font-size: 1.5vmax;
        padding-top:0 ;
    }

    .detail-button{
        font-size: 1.7vmax;
        height: 3.5vmax;
    }

    .nav{
        position: absolute;
        left: 0;
        top: 13%;
        width: fit-content;
        min-width: 35%;
        z-index: 3;
        background-color: rgb(180, 230, 180);
        opacity: 0.95;
        font-size: 2vmax;
        padding-right: 1vmax;
        border-radius: 0 0 1vmax 0;
        animation: leftright ease 1s;
    }

    .nav-button{
        margin-top: 3vmax;
        padding-inline:.2vmax  ;
        top:13%
    }

    .sub{
        font-size: 1.7vmax;
    }

    .container{
        width: 100%;
        padding-inline: 1vmax;
    }

}

@keyframes leftright{
    from {left:-200px}
    to {left:0}
}

</style>