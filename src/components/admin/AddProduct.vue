<template>
    <div id="addProduct">
        <div id="form-container">
            <form id="form" @submit.prevent>
                <div class="form-group">
                    <label class="text-left" for="category">İsim</label>
                    <input type="text" class="form-control" id="category" v-model="$v.product.name.$model">
                </div>
                <div class="form-group">
                    <label class="text-left" for="category">Kategori</label>
                    <select class="form-control" @change="onCatChange()" v-model="$v.product.category.$model">
                        <option value="" selected disabled>Kategori Seçin</option>
                        <option v-for="(cat, index) in categories" :key="index" :value="cat.title">{{cat.title}}</option>
                    </select>
                    <div class="input-group">
                        <input type="text" class="form-input" id="category" v-model="addN.category" placeholder="Yeni Kategori Ekle">
                        <button class="input-button" @click="addNew(1)">Ekle</button>
                    </div>
                </div>
                <div class="form-group">
                    <label class="text-left" for="subSategory">Alt Kategori</label>
                    <select class="form-control" v-model="$v.product.subCategory.$model">
                        <option value="" selected disabled>Alt Kategori Seçin</option>
                        <option v-for="(subCat, index) in subCategories" :key="index" :value="subCat">{{subCat}}</option>
                    </select>
                    <div class="input-group">
                        <input type="text" class="form-input" id="category" v-model="addN.subCategory" placeholder="Yeni Alt Kategori Ekle">
                        <button class="input-button" @click="addNew(2)">Ekle</button>
                    </div>
                </div>
                <div class="form-group">
                    <label class="text-left" for="brand">Marka</label>
                    <select class="form-control" v-model="$v.product.brand.$model">
                        <option value="" selected disabled>Marka Seçin</option>
                        <option v-for="(brand, index) in brands" :key="index">{{brand}}</option>
                    </select>
                    <div class="input-group">
                        <input type="text" class="form-input" id="category" v-model="addN.brand" placeholder="Yeni Marka Ekle">
                        <button class="input-button"  @click="addNew(3)">Ekle</button>
                    </div>
                </div>
                <div class="form-group">
                    <label class="text-left" for="description">Açıklama</label>
                    <textarea type="text" class="form-control" :style="{'height':'5vmax', 'line-height':'1vmax'}" id="description" v-model="$v.product.description.$model"></textarea>
                </div>
                <div class="form-group">
                    <label class="text-left" for="description">Resim</label>
                    <input type="file" accept="image/*" ref="inputImage" class="form-control" @change="chooseImage($event)" :style="{'display':'none'}">
                    <button id="inputButton" @click="$refs.inputImage.click()">Ekle</button>
                </div>
                <div>
                    <img v-if="product.image" :src="croppedImageSrc" class="productImage">
                </div>
                <div class="button-group">
                    <button id="save" type="button" @click="save($event)" class="btn" :disabled="$v.$invalid">
                        Kaydet
                        <p class="warn" v-if="$v.$invalid">Boş alanları doldurun</p>
                    </button>
                    <button type="reset" @click="reset" class="btn">Temizle</button>
                </div>
                
            </form>
        </div>
        <div id="cropperview" ref="cv">
            <div v-if="this.imageSrc" class="view">
                <vue-cropper
                    class="cropper"
                    ref="cropper"
                    :guides="true"
                    :src="imageSrc"
                    :aspectRatio="1/1"
                    :outputSize="1"
                    :fixedBox="true"
                    :maxImgSize="800"
                ></vue-cropper>
                <div class="buttons">
                    <button @click="cropImage">Kırp</button>
                    <button @click="SetProductImage(), $refs.cv.style.display='none'">Kaydet</button>
                    <button @click="$refs.cv.style.display='none'">Çıkış</button>
                </div>
                <img v-if="croppedImageSrc" :src="croppedImageSrc" />
            </div>
        </div>
        <waiting v-if="wait"/>
    </div>
</template>

<script>
//import Cropper from 'cropperjs'
import { db } from "../../../firebase.js"
import firebase from "firebase"
import VueCropper from "vue-cropperjs"
import 'cropperjs/dist/cropper.css';
import { eventBus } from "../../main"
import { mapGetters } from "vuex"
import { required } from    "vuelidate/lib/validators"
import Waiting from '../Waiting';

export default {
    
    components:{
        VueCropper,
        Waiting,
    },

    validations:{
        product:{
            name:{
                required
            },
            category:{
                required
            },
            subCategory:{
                required
            },
            brand:{
                required
            },
            description:{
                required
            },
            image:{
                required
            }
        }
    },

    data() {
        return{
            imageSrc:null,
            croppedImageSrc:null,
            file:null,
            product:{
                name:null,
                category:null,
                subCategory:null,
                brand:null,
                description:null,
                image:null,
            },
            addN:{
                category:null,
                subCategory:null,
                brand:null,
            },
            categories:[],
            subCategories:[],
            brands:[],
            wait:false,
        }
    },

    watch:{
        croppedImageSrc(){
            window.addEventListener("resize",()=>{
                document.getElementById("cropperview").style.height=document.body.scrollHeight+"px"
            })
        }
    },

    created(){
        eventBus.$on("SaveProductFinished",()=>{
            document.getElementById("save").style.disabled=false
            this.wait=false
        })


    },

    mounted(){
        this.categories=this.$store.getters.getFilters.categories
        this.brands=this.$store.getters.getFilters.brands
        
        /*sil*/
        this.$store.dispatch("getFilters")
    },

    computed:{
        ...mapGetters(["getFilters"]),

    },

    methods:{
        
        chooseImage(e){
            window.scrollTo(0,0)
            document.getElementById("cropperview").style.display="flex"
            document.getElementById("cropperview").style.height=document.body.scrollHeight+"px"
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
            document.getElementById("cropperview").style.height=document.body.scrollHeight+"px"
        },

        async SetProductImage(){
            this.resizeImg(this.croppedImageSrc,500,500).then(result=>{
                return this.dataURLtoFile(result,this.file.name)
            }).then(img=>{
                this.product.image=img
                document.getElementById("inputButton").innerHTML="Değiştir"
            }).catch(err=>{
                console.log(err)
            })
            //this.product.image = this.dataURLtoFile(img,this.file.name)
        },

        save(event){
            let conf=confirm("Kaydedilsin mi?")
            if(conf){
                this.wait=true
                this.$store.dispatch("saveProduct",this.product)
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

        resizeImg(base64, newWidth, newHeight) {
            return new Promise((resolve, reject)=>{
                var canvas = document.createElement("canvas");
                canvas.width=newWidth
                canvas.height=newHeight
                let context = canvas.getContext("2d");
                let img = document.createElement("img");
                img.src = base64;
                img.onload = function () {
                    context.scale(newWidth/img.width,  newHeight/img.height);
                    context.drawImage(img, 0, 0); 
                    resolve(canvas.toDataURL());     
                    reject(e=>{
                        console.log(e)
                    })          
                }
            });
        },

        onCatChange(){
            this.subCategories=this.categories.filter(e=>{
                return e.title==this.product.category
            })[0].sub
        },

        reset(){
            this.product={
                name:null,
                category:null,
                subCategory:null,
                brand:null,
                description:null,
                image:null,
            }
        },

        addNew(value){
            switch (value){
                case 1:
                    if(this.addN.category!=null){
                        let key = this.addN.category
                        db.collection("filters").doc("categories").update({[key]:[]})
                        .then(()=>{
                            let obj=new Object({
                                title:key,
                                sub:[]
                            })
                            this.categories.push(obj)
                            alert("Eklendi")
                        }).catch((error)=>{
                            alert("Bir hata oldu")
                            console.log(error)
                        })
                    }else{
                        alert("Boş alan var")
                    }
                    break;
                case 2:
                    if(this.addN.subCategory!=null & this.product.category!=null){
                        let key =this.product.category
                        let val=this.addN.subCategory
                        db.collection("filters").doc("categories").update({
                            [key]: firebase.firestore.FieldValue.arrayUnion(val)
                            })
                        .then(()=>{
                            this.subCategories.push(val)
                            alert("Eklendi")
                        }).catch(()=>{
                            alert("Bir hata oldu")
                        })
                    }else{
                        alert("Kategori Alanını Doldurun")
                    }
                    break;
                case 3:
                    if(this.addN.brand!=null){
                        let key = "name"
                        let val = this.addN.brand
                        db.collection("filters").doc("brands").update({
                            [key]:firebase.firestore.FieldValue.arrayUnion(val)
                        }).then(()=>{
                            this.brands.push(val)
                            alert("Eklendi")
                        }).catch((error)=>{
                            alert(error)
                        })
                    }else{
                        alert("Boş alan var")
                    }
                    break;
            }
        },
    },
}
</script>

<style scoped>
    ::-webkit-scrollbar-thumb {
        background: rgb(0, 180, 200);
    }
    ::-webkit-scrollbar-thumb:window-inactive {
        background: rgb(0, 180, 200);
    }

    #app{
        height: fit-content;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-between;
    }

    #form-container{
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        font-weight:bold;
        width: 40%;
        height: fit-content;
        border: 1px solid rgb(180, 180, 180);
        margin:1vmax;
        border-radius: 0.5vmax;
        box-shadow: 0 0 0.5vmax 0.1vmax rgb(180, 180, 180);
        background-color:rgb(245, 255, 255);
    }

    #form{
        display: flex;
        flex-direction: column;
        width: 100%;
        height: fit-content;
        border-radius: 0.5vmax;
    }

    .form-group{
        display: flex;
        flex-direction: column;
        margin: 0.5vmax;
        padding: 0.5vmax;
        border-radius: 0.5vmax;
        /*box-shadow: inset 0 0 0.3vmax 0.1vmax rgb(180, 180, 180);*/
        background-color:rgb(245, 255, 255);
    }

    .text-left{
        display: flex;
        justify-content: left;
        align-items: center;
        padding: 0.5vmax;
        font-size: 1.2vmax;
    }

    .form-control{
        box-sizing: border-box;
        outline: none;
        border-radius: .5vmax;
        border: 1px solid rgb(199, 199, 199);
        height:2vmax;
        margin: 0.3vmax;
        padding-inline: 0.8vmax;
        line-height: 3vmax;
    }

    .btn{
        position: relative;
        margin:1vmax;
        margin-bottom: 3vmax;
        height: 2vmax;
        width: 5vmax;
        border-radius: 0.5vmax;
        border: 1px solid rgb(199, 199, 199);
        background-color:rgba(180, 230, 240, 1);
        box-shadow: 0 0 0.5vmax 0.1vmax rgb(180, 180, 180);
        cursor: pointer;
        font-weight: 600;
        font-size: 1vmax;
    }

    .btn:hover{
        box-shadow: 0 0;
    }

    .input-group{
        position: relative;
        outline:none;
        display: flex;
        flex-direction: row;
        box-sizing: border-box;
        height: 2vmax;
        margin: 0.3vmax;
        font-size: 1vmax;
    }

    .form-input{
        box-sizing: border-box;
        outline: none;
        border-radius: .5vmax 0 0 .5vmax;
        border: 1px solid rgb(199, 199, 199);
        height: 100%;
        width: 85%;
        padding-inline: 1vmax;
        font-size: inherit;
    }

    .input-button{
        height: 100%;
        width: 15%;
        border: none;
        border-radius: 0vmax 0.5vmax 0.5vmax 0vmax;
        background-color:rgba(190, 230, 240, 1);
        border: 1px solid rgb(199, 199, 199);
        font-size: inherit;
        cursor:pointer;
    }

    #cropperview{
        display: none;
        position: absolute;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
        top: 0;
        left: 0;
        height: 110%;
        width: 99vw;
        z-index: 2;
        backdrop-filter: blur(10px);
        transform-style: preserve-3d;
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
        z-index: 2;
        box-shadow: -1vmax 1vmax 1vmax -0.5vmax rgb(70, 70, 70);
    }
    #cropperview .buttons{
        z-index : 3;
        display : flex;
        position: absolute;
        top: 0.5vmax;
        right: 0.5vmax;
        margin: 0.5vmax;
        font-size: 1vmax;
    }
    #cropperview .buttons button{
        cursor : pointer;
        height: 2.5vmax;
        width: 5vmax;
        border-radius:0.5vmax;
        border: none;
        box-sizing: border-box;
        margin-inline: 0.25vmax;
        background-color:rgb(0, 180, 200);
        box-shadow: 0 0 0.5vmax 0.1vmax rgb(105, 105, 105);
        font-weight: 600;
        text-align:center;
        font-size: inherit;
    }
    /*#cropperview .buttons{
        z-index : 3;
        display : flex;
        position: absolute;
        top: 0.5vmax;
        right: 0.5vmax;
    }
    #cropperview .buttons button{
        cursor : pointer;
        margin: 0.2vmax;
        border-radius:0.5vmax ;
        border: none;
        box-sizing: content-box;
        padding-inline: 0.7vmax;
        padding-block: 0.2vmax;
        background-color:rgb(0, 180, 200);
        box-shadow: 0 0 0.5vmax 0.1vmax rgb(105, 105, 105);
    }*/
    #cropperview .buttons button:hover{
        box-shadow: 0 0 0.5vmax 0.1vmax rgb(105, 135, 125);

    }
    #cropperview img{
        margin: 1vmax;
        z-index: 2 ;
        width: 30%;
        height: auto;
        box-shadow: -1vmax 1vmax 1vmax -0.5vmax rgb(70, 70, 70);
    }
    .view{
        display: flex;
        flex-direction:row;
        align-items: flex-start;
        padding-top: 5vmax;
        justify-content: center;
        height: fit-content;
        width: 100%;
    }

    .productImage{
        float: left;
        margin-left: 1vmax;
        margin-bottom: 1.5vmax;
        width: 20vh;
        height: auto;
        border-radius: .5vmax;
    }
    .button-group{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        width: fit-content;
        margin: 0.5vmax;
        font-size: 1vmax;
    }

    #inputButton{
        height: 2vmax;
        border: none;
        border-radius: 0.5vmax;
        background-color:rgba(190, 230, 240, 1);
        border: 1px solid rgb(199, 199, 199);
        box-shadow: 0 0 1vmax -0.5vmax rgb(120, 120, 120);
        font-size: 1vmax;
        cursor:pointer;
    }

    #inputButton:hover{
        box-shadow: 0 0 0 0;
    }

    .warn{
        position: absolute;
        width: 10vmax;
        color: red;
        top:100%;
        left: 0%;
        text-align: left;
        font-size: 0.8vmax ;
    }

    @media screen and (max-width: 700px) {
        
        #app{
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        .view{
            margin-top: 4vmax;
            flex-direction: column;
            align-items: center;
            justify-content: start;
            max-height: 100%;
        }

        #cropperview img{
            width: 60%;
        }
        .cropper{
            width: 60%;
        }

        #cropperview .buttons button{
            height: 4vmax;
            width: 9vmax;
            margin-right: 1vmax;
            font-size: 1.7vmax;
        }

        #form-container{
            width:90%;
            margin-top:2vmax;
        }

        .text-left{
            font-size: 2vmax;
        }

        .form-control{
            height: 4vmax;
        }

        .input-group{
            height: 4vmax;
            font-size: 1.7vmax;
        }

        #inputButton{
            height: 4vmax;
            font-size: 1.7vmax;
        }

        .btn{
            height: 4vmax;
            font-size: 1.7vmax;
            width: 10vmax;
        }

        .warn{
            width: 15vmax;
            font-size: 1.2vmax;
        }
    }
</style>