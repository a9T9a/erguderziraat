import Vue from "vue"
import VueRouter from "vue-router"
import Home from "../views/Home.vue"
import Admin from "../views/Admin.vue"
import AddProduct from "../components/admin/AddProduct"
import AddImage from "../components/admin/AddImage"
import ProductList from "../components/ProductList"
import Client from "../views/Client"
import Dealership from "../views/Dealership"
import About from "../views/About"

Vue.use(VueRouter)

const routes = [
    {
        path:"/",
        name:"Client",
        component:Client,
        children:[
            
            {
                path:"/",
                name:"Home",
                component:Home
            },

            {
                path:"/productlist",
                name:"ProductList",
                component:ProductList
            },

            {
                path:"/about",
                name:"About",
                component:About
            },

            {
                path:"/dealership",
                name:"Dealership",
                component:Dealership
            },
        ]
    },


    {
        path:"/admin",
        name:"Admin",
        component:Admin,
        children:[
            {
                path:"addProduct",
                name:"AddProduct",
                component:AddProduct,
            },
            {
                path:"addImage",
                name:"AddImage",
                component:AddImage
            }
        ]

    }
]

const router = new VueRouter({
    routes,
    mode:"history"
})

export default router;