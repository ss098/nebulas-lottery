import Vue from "vue"
import Router from "vue-router"
import Introduction from "@/components/Introduction"
import Create from "@/components/Create"
import Detail from "@/components/Detail"
import axios from "axios"

window.axios = axios

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'introduction',
            description: "介绍",
            icon: "fa-copy",
            component: Introduction
        },
        {
            path: '/create',
            name: 'create_lottery',
            description: "创建抽奖",
            icon: "fa-random",
            component: Create
        },
        {
            path: '/detail',
            name: 'detail',
            component: Detail
        }
    ]
})
