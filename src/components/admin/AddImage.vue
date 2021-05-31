<template>
    <div id="addImage">
        <div id="storedimgs">
            <input type="file" accept="image/*" @change="chooseImage($event)" ref="input" :style="{'display':'none'}">
            <img class="img-container" src="../../assets/addImage.png" @click="$refs.input.click()">
            <div :id="index" class="img-container" v-for="(item, index) in getImages" :key="index" @mouseover="show=index" @mouseleave="show=null">
                <img class="add" :src="item.imageURL">
                <transition-group name="fade">
                    <p v-if="show==index" :key="0" class="description">{{item.description}}</p>
                    <img v-if="show==index" :key="1" class="delete" src="../../assets/remove.png" @click="deleteImage(item.id,item.imageURL)">
                </transition-group>
            </div>
        </div>
        <div id="cropperview" ref="cv">
            <div v-if="this.imageSrc" class="view">
                <vue-cropper
                    class="cropper"
                    ref="cropper"
                    :guides="true"
                    :src="imageSrc"
                    :aspectRatio="16/9"
                ></vue-cropper>
                <div class="info">
                    <input type="text" class="form-control" :style="{width:'50vmax'}" placeholder="Resim açıklaması" v-model="item.description">
                </div>
                <div class="buttons d-flex flex-row">
                    <button @click="cropImage">Kırp</button>
                    <button @click="save(), $refs.cv.style.display='none'">Kaydet</button>
                    <button @click="$refs.cv.style.display='none'">Çıkış</button>
                </div>
                <img v-if="this.croppedImageSrc" :src="croppedImageSrc" />
            </div>
        </div>
        <waiting v-if="wait"/>
    </div>
</template>

<script>
import VueCropper from "vue-cropperjs"
import 'cropperjs/dist/cropper.css';
import { mapGetters } from "vuex"
import { eventBus } from "../../main"
import Waiting from "../Waiting"

export default {
    components:{
        VueCropper,
        Waiting
    },
    data(){
        return{
            imageSrc:null,
            croppedImageSrc:null,
            file:null,
            item:{
                image:null,
                description:null
            },
            show:null,
            wait:false
        }
    },

    created(){
        eventBus.$on("SaveImageFinished",()=>{
            this.wait=false
        })
    },

    computed:{
        ...mapGetters(["getImages"])
    },

    methods:{

        chooseImage(e){
            window.scrollTo(0,0)
            document.getElementById("cropperview").style.height=document.body.scrollHeight+"px"
            document.getElementById("cropperview").style.display="flex"
            this.file = e.target.files[0]
            if (!this.file.type.includes("image/")) {
                alert("Please select an image file")
                return
            }
            if (typeof FileReader === "function") {
                const reader = new FileReader()
                reader.onload = event => {
                    this.imageSrc = event.target.result

                    // Rebuild cropperjs with the updated source
                    this.$refs.cropper.replace(event.target.result)
                }
                reader.readAsDataURL(this.file)
            } else {
            alert("Sorry, FileReader API not supported")
            }
        },

        cropImage(){
            this.croppedImageSrc = this.$refs.cropper.getCroppedCanvas().toDataURL()
        },

        save(){
            let conf = confirm("Kaydedilsin mi?")
            if(conf){
                this.wait=true
                this.resizeImg(this.croppedImageSrc,800,450).then(result=>{
                    return this.dataURLtoFile(result,this.file.name)
                }).then(img=>{
                    this.item.image=img
                    this.$store.dispatch("saveimage",this.item)
                }).catch(err=>{
                    console.log(err)
                })
            }
        },

        dataURLtoFile(dataurl, filename) {
            var arr = dataurl.split(','),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), 
                n = bstr.length, 
                u8arr = new Uint8Array(n);
            while(n--){
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, {type:mime});
        },
        
        resizeImg(image, newWidth, newHeight) {
            return new Promise((resolve, reject)=>{
                var canvas = document.createElement("canvas");
                canvas.width=newWidth
                canvas.height=newHeight
                let context = canvas.getContext("2d");
                let img = document.createElement("img");
                img.src = image;
                img.onload = function () {
                    context.scale(newWidth/img.width,  newHeight/img.height);
                    context.drawImage(img, 0, 0); 
                    resolve(canvas.toDataURL());         
                }
            });
        },

        deleteImage(id,url){
            let conf=confirm("Resmi Silinsin Mi?")
            if(conf){
                let str = String(url)
                let findchar = str.indexOf("?")
                let raw = str.slice((findchar-6), findchar)
                let ext = raw.slice(raw.indexOf("."))
                this.$store.dispatch("deleteImage",{id,ext})
            }
        }
    }
}
</script>

<style scoped>

    .img-container{
        position: relative;
        width: 22vmax;
        height: 12.4vmax;
        object-fit:scale-down;
        float: left;
        margin: 0.5vmax;
        box-shadow: 0vmax 0vmax 1.2vmax -0.1vmax rgba(100,100,100,0.7);
        cursor:pointer;
    }
    .add{
        height: 100%;
        width: 100%;
    }
    .description{
        position: absolute;
        top: 70%;
        width: 100%;
        height: 30%;
        background-color: rgba(100,100,100,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(20px);
        font-size:1.2vmax;
        font-weight: 700;
        color: bisque;
        border-radius: -1vmax 1vmax 0 0;
    }
    .delete{
        position: absolute;
        top:0;
        right:0;
        width: 8%;
        height:auto;
        cursor: pointer;

    }

    #cropperview{
        display: none;
        position: absolute;
        flex-direction: row;
        justify-content: space-between;
        top: 0;
        left: 0;
        height: 100vh;
        width: 100vw;
        z-index: 1;
        
    }

    #cropperview::after{
        content: "";
        position: absolute;
        background-color: rgba(100,100,100,0.7);
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        opacity: 0.9;
    }
    .cropper{
        margin: 1vmax;
        width: 40%;
        height: auto;
        z-index: 1;
        box-shadow: 0 0 6vmax 2vmax rgb(70, 70, 70);
    }
    #cropperview .buttons{
        z-index : 3;
        display : flex;
        position: absolute;
        top: 0.5vmax;
        right: 0.5vmax;
        margin: 0.5vmax;
    }
    #cropperview .buttons button{
        cursor : pointer;
        height: 2vmax;
        width: 5vmax;
        border-radius:0.5vmax;
        border: none;
        box-sizing: border-box;
        margin-inline: 0.25vmax;
        background-color:rgb(0, 180, 200);
        box-shadow: 0 0 0.5vmax 0.1vmax rgb(105, 105, 105);
        font-weight: 600;
        text-align:center;
    }
    #cropperview .buttons button:hover{
        box-shadow: 0 0 0.5vmax 0.1vmax rgb(105, 135, 125);

    }

    #cropperview .info{
        position: absolute;
        z-index: 3;
        display: flex;
        flex-direction: row;
        top: 0.5vmax;
        left:0.5vmax;
        width: fit-content;
        margin: 0.5vmax;
    }
    .form-control{
        box-sizing: border-box;
        outline: none;
        border-radius: .5vmax;
        border: 1px solid rgb(199, 199, 199);
        height:2vmax;
        padding-inline: 1vmax;
    }

    #cropperview input{
        box-shadow: 0 0 0.5vmax 0.1vmax rgb(105, 105, 105);
    }
    #cropperview img{
        margin: 1vmax;
        z-index: 2 ;
        width: 30%;
        height: auto;
        box-shadow: 0 0 6vmax 2vmax rgb(70, 70, 70);
    }

    .view{
        display: flex;
        flex-direction:row;
        align-items: flex-start;
        padding-top: 5vmax;
        justify-content: center;
        height: 100%;
        width: 100%;
    }



    .fade-enter{
        opacity: 0;
    }
    .fade-enter-active{
        transition: ease-out 0.7s;
    }

    .list-leave-to, .list-enter{
        opacity: 0;
    }
    .list-leave-active, .list-enter-active{
        transition : ease-out .7s;
    }


    @media screen and (max-width: 700px) {
        #cropperview img{
            width: 60%;
        }
        .cropper{
            width: 60%;
        }
    }
</style>