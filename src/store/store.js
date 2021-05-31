import Vue from "vue";
import Vuex from "vuex";
import { db } from "../../firebase.js"
import firebase from "firebase"
import { eventBus } from "../main"

Vue.use(Vuex);

export default new Vuex.Store({

  state: {
    images:[],
    products:[],
    filters:{
      categories:[],
      brands:[]
    },
    catFilter:null,
    subFilter:null,
  },

  getters:{
    
    getImages(state){
      return state.images
    },

    getProducts(state){
      
      if(state.catFilter==null && state.subFilter==null){
        return state.products
      }else if(state.catFilter!=null && state.subFilter==null){
        return state.products.filter(product=>product.category==state.catFilter)
      }else{
        return state.products.filter(product=>product.category==state.catFilter && product.subCategory==state.subFilter)
      }

    },

    getNewProducts(state){
      return state.products.slice(0,6)
    },

    getFilters(state){
      return state.filters
    }

  },

  mutations: {

    setImages(state,value){
      state.images=value.reverse()
      eventBus.$emit("imagesReady")
    },

    setProducts(state,value){
      state.products=value
      eventBus.$emit("productsReady")
    },

    addtoImages(state,value){
      state.images.unshift(value)
    },

    deleteImage(state,value){
      let index = state.images.findIndex(img=>img.id==value)
      state.images.splice(index,1)
    },

    setFilters(state,{categories,brands}){
      state.filters.categories=categories
      state.filters.brands=brands
    },

    setCatFilter(state,value){
      state.catFilter=value
    },

    setSubFilter(state,value){
      state.subFilter=value
    }

  },

  actions: {

    async getProducts({commit,state}){
      let list=[]
      await db.collection("products").orderBy("addedDate","desc").get()
      .then(snap=>{
        snap.forEach(doc=>{
          let obj = new Object({
            id:doc.id,
            ...doc.data()
          })
          list.push(obj)
        })
      })
      .then(()=>{
        commit("setProducts",list)
      })
    },
    
    async getImages({commit,state}){
      /*firebase.storage().ref().child("images/").listAll()
      .then(res=>{
        res.items.forEach(item=>{
          item.getDownloadURL()
          .then(url=>{
            state.images.push(url)
          })
        })
      })
      .then(()=>{
        //commit("setImages",this.list)
        console.log("list",state.images)
      })*/

      let item=[]

      await db.collection("images").orderBy("addedDate").get()
        .then(snap=>{
          snap.forEach(doc=>{
            let obj = new Object({
              id:doc.id,
              ...doc.data()
            })
            item.push(obj)
          })
        })

        commit("setImages",item)
    },

    async saveProduct({commit,state},product){
      var key
      var imageUrl

      await db.collection("products").add({
        name:product.name,
        category: product.category,
        subCategory: product.subCategory,
        brand: product.brand,
        description: product.description,
        addedDate: firebase.firestore.Timestamp.now().seconds
      })
      .then(result=>{
        key=result.id
        return key
      })
      .then(async key=>{
        const filename = product.image.name
        const ext = filename.slice(filename.lastIndexOf("."))
        await firebase.storage().ref("productimages/"+key+ext).put(product.image)
        .then(data=>{
          return data.ref.getDownloadURL()
        })
        .then(url=>{
          imageUrl=url
        })
      })
      
      await db.collection("products").doc(key).update({
        imageURL:imageUrl
      })
      .then(()=>{
        eventBus.$emit("SaveProductFinished")
        alert("Kaydetme Başarılı")
      })
      .catch(err=>{
        console.log(err)
        alert("Bir sorun oluştu")
      })
    },
    
    async saveimage({commit,state},item){
      /*firebase.storage().ref("images/"+image.name).put(image)
      .then(data=>{
        data.ref.getDownloadURL()
        .then(url=>{
          console.log(url)
        })
        alert("Yükleme Başarılı")
      })*/

      var key
      var imageUrl
      var added_date = firebase.firestore.Timestamp.now().seconds

      await db.collection("images").add({
        description: item.description,
        addedDate: added_date
      })
      .then(result=>{
        key=result.id
        return key
      })
      .then(async key=>{
        const filename = item.image.name
        const ext = filename.slice(filename.lastIndexOf("."))
        await firebase.storage().ref("images/"+key+ext).put(item.image)
        .then(data=>{
          return data.ref.getDownloadURL()
        })
        .then(url=>{
          imageUrl=url
        })
      })

      await db.collection("images").doc(key).update({
        imageURL:imageUrl
      })
      .then(()=>{
        var obj=new Object({
          id:key,
          description: item.description,
          addedDate: added_date,
          imageURL: imageUrl
        })
        commit("addtoImages",obj)
        eventBus.$emit("SaveImageFinished")
        alert("Kaydetme Başarılı")
      })
      .catch(err=>{
        console.log(err)
        alert("Bir sorun oluştu")
      })

    },

    deleteImage({commit,state},{id,ext}){
      firebase.storage().ref("images/"+id+ext).delete()
      .then(()=>{
        db.collection("images").doc(id).delete()
        .then(()=>{
          commit("deleteImage",id)
          //eventBus.$emit("deleted",id,index)
        })
        .catch(err=>{
          alert(err)
          console.log(err)
        })
      })

    },

    async getFilters({commit}){
      let categories = []
      let brands = []

      await db.collection("filters").doc("categories").get()
      .then(snap=>{
        let data=snap.data()
        Object.keys(data).forEach(key=>{
          let obj = new Object({
            "title":key,
            "sub":data[key]
          })
          categories.push(obj)
        })
      })

      await db.collection("filters").doc("brands").get()
      .then(snap=>{
        let list=snap.data()
        brands=list.name
      })

      commit("setFilters",{categories,brands})
    }
  },
  modules: {},
});
