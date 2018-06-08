<template>
    <div id="app">
        <div class="tabs is-centered">
            <ul>
                <li v-for="route in $router.options.routes" v-if="route.description"
                    :class="{'is-active': $route.name === route.name}">
                    <router-link :to="{name: route.name}">
                        <span v-if="route.icon" class="icon is-small">
                            <i :class="`fas ${route.icon}`" aria-hidden="true"></i>
                        </span>
                        {{ route.description }}
                    </router-link>
                </li>
            </ul>
        </div>
        <router-view :nebpay="nebpay" :contract_address="contract_address" :nebpay_address="nebpay_address" />
    </div>
</template>
<style>
    body, .button {
        font-weight: 100;
    }

    .panel-items > .panel-block {
        padding: 0;
    }

    .panel-items > .panel-block > p > input {
        border: none;
        box-shadow: none;
        border-radius: 0;
    }

    .panel-items > .panel-block > .item-right {
        position: relative;
        visibility: hidden;
    }

    .panel-items > .panel-block:hover > .item-right {
        visibility: visible;
    }

    .panel-items > .panel-block .item-right > .button {
        border: none !important;
    }

    .panel-items > .panel-block .item-right > .button:hover {
        background-color: whitesmoke;
    }

    .panel-block > .content {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
</style>
<script>
    import 'bulma/css/bulma.css'
    import nebpayjs from "nebpay.js"

    export default {
        data: function () {
            return {
                nebpay: new nebpayjs(),
                nebpay_address: "https://mainnet.nebulas.io",
                contract_address: "n1py9gBwfJn9iV3VufNay5bR9imEUkjqmNM"
            }
        }
    }
</script>
