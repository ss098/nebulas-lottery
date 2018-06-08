<template>
    <div class="container">
        <article v-if="message" class="message is-info">
            <div class="message-body">
                {{ message }}
            </div>
        </article>

        <loading v-if="loading"></loading>
        <div v-else-if="lottery">
            <article v-if="lottery.message" class="message is-info">
                <div class="message-header">
                    <p>抽奖说明</p>
                </div>
                <div class="message-body">
                    {{ lottery.message }}
                </div>
            </article>

            <div class="columns">
                <div class="column is-one-quarter">
                    <nav v-if="lottery.reward.length > 0" class="panel">
                        <p class="panel-heading">
                            奖品
                        </p>
                        <a v-for="(reward, index) in lottery.reward" class="panel-block">
                            {{ reward.name }}

                            <span style="margin-left: 1em;" class="tag is-link">{{ reward.count }} 个</span>
                        </a>
                        <div class="panel-block">
                            <span class="panel-icon">
                                <i class="fas fa-gift" aria-hidden="true"></i>
                            </span>
                            <span class="content">
                                奖品提供者
                                {{ lottery.create_address }}
                            </span>
                        </div>

                        <div class="panel-block">
                            <span v-if="lottery_result" class="icon is-left" style="margin-right: 1.5em;margin-left: 0.75em;">
                                <div class="tag is-link">
                                    已开奖
                                </div>
                            </span>

                            参与抽奖人数 {{ Object.keys(lottery.join_address).length }} / {{ lottery.count }} 人
                        </div>

                        <div class="panel-block" v-if="!lottery_result">
                            <loading v-if="join_loading"></loading>

                            <div v-else-if="lottery.address.length > 0 && lottery.address.indexOf(address) === -1">
                                奖品提供者限制了钱包地址，你不在其中
                            </div>

                            <div v-else-if="lottery.join_address.hasOwnProperty(address)">
                                你已加入抽奖
                            </div>

                            <div v-else-if="join_message">
                                {{ join_message }}
                            </div>

                            <button v-else @click="join" class="button is-link is-outlined is-fullwidth">
                                我也要加入抽奖
                            </button>
                        </div>
                    </nav>
                </div>
                <div class="column">
                    <nav v-if="lottery.reward.length > 0" class="panel">
                        <p class="panel-heading">
                            <span class="icon">
                                <i class="fas fa-users" aria-hidden="true"></i>
                            </span>
                            参与者
                        </p>

                        <div v-for="(detail, join_address) in lottery.join_address" :class="{'panel-block': true, 'is-active': join_address === address}">
                            <div class="content">
                                <p>钱包地址： {{ join_address }}</p>
                                <p>交易哈希： {{ detail.hash }}</p>
                                <div v-if="lottery_result">
                                    开奖结果：
                                    <span v-if="lottery_result[join_address]" class="tag is-link">
                                        {{ lottery_result[join_address] }}
                                    </span>
                                    <span v-else>
                                        未中奖
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div v-if="Object.keys(lottery.join_address).length <= 0" class="panel-block">
                            <span class="panel-icon">
                                <i class="fas fa-user-friends" aria-hidden="true"></i>
                            </span>

                            还没有人参与抽奖，赶快加入吧
                        </div>
                    </nav>

                    <p v-if="Object.keys(lottery.join_address).length < lottery.count">
                        参与人数足够后才能开奖，将页面链接发给朋友邀请他参与抽奖，参与后本页面自动更新。
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data: function () {
            return {
                loading: false,
                lottery: null, // 抽奖信息
                message: null, // 消息

                address: null, // 钱包地址
                request: null, // 网络请求
                timer: null, // 定时器

                // 加入抽奖的信息
                join_loading: false,
                join_request: false,
                join_message: null,
                join_hash: null, // 加入抽奖所产生的 Transaction Hash
            }
        },
        computed: {
            hash: function () {
                return this.$route.query.hash
            },
            lottery_result: function () {
                return this.lottery_compute(this.lottery)
            }
        },
        props: {
            nebpay: null,
            nebpay_address: null,
            contract_address: null
        },
        watch: {
            hash: function () {
                this.get_lottery()
            }
        },
        methods: {
            get_lottery: function () {
                // 通过 HTTP API 获取的数据不是最新的
                // 这个 API 仅能用于验证抽奖是否存在

                this.loading = true
                this.lottery = null
                clearInterval(this.timer)

                if (this.request) {
                    this.request.cancel("hash change")
                }
                this.request = axios.CancelToken.source()

                axios.post(`${this.nebpay_address}/v1/user/getTransactionReceipt`, {
                    hash: this.hash
                }, {cancelToken: this.request.token}).then((response) => {
                    let data = response.data.result

                    if (data.status === 1) {
                        // 交易完成

                        this.get_lottery_detail()
                        this.timer = setInterval(this.get_lottery_detail, 10000)
                    } else if (data.status === 2) {
                        // 正在交易
                        this.message = "请等待区块链网络处理交易"
                        setTimeout(this.get_lottery, 2000)
                    } else if (!data.status) {
                        // 交易失败

                        this.message = "创建抽奖失败"
                        this.loading = false
                    }
                }).catch((error) => {
                    this.message = "获取抽奖信息失败"
                    this.loading = false
                })
            },
            get_lottery_detail: function () {
                // 获取抽奖数据

                const nebpay = this.nebpay
                const self = this
                const hash = this.hash

                this.join_loading = false
                this.join_message = null
                this.join_request = null

                nebpay.simulateCall(this.contract_address, 0, "get", JSON.stringify([hash]), {
                    listener: ({result}) => {
                        this.loading = false
                        this.message = null

                        let data = JSON.parse(result)

                        self.lottery = data.lottery
                        self.address = data.transaction.from
                    }
                })
            },
            lottery_compute: function (lottery) {
                if (lottery.force_lottery || Object.keys(lottery.join_address).length >= lottery.count) {
                    const join_address = lottery.join_address,
                        reward = lottery.reward

                    let reward_list = [] // 奖品列表

                    reward.map((reward) => {
                        // 把所有奖品平铺开

                        for (let i = 0; i < reward.count; i++) {
                            reward_list.push(reward.name)
                        }
                    })

                    const address = Object.keys(join_address)

                    let address_summation = address.map((address) => {

                        const hash = join_address[address].hash
                        let summation = 0

                        for (let i = 0; i < hash.length; i++) {
                            const hash_number = parseInt(hash[i], 16)

                            if (i % 2 === 0) {
                                summation += hash_number
                            } else {
                                summation -= hash_number
                            }
                        }

                        return {
                            address: address,
                            summation: summation
                        }
                    }).sort((a, b) => {
                        // 降序
                        return b.summation - a.summation
                    })

                    let result = {}

                    address_summation.forEach(({address, summation}, index) => {
                        if (reward_list[index]) {
                            result[address] = reward_list[index]
                        }
                    })

                    return result
                }

                return false
            },
            join: function () {
                const nebpay = this.nebpay
                const self = this

                nebpay.call(this.contract_address, 0, "join", JSON.stringify([{
                    name: "", // 名称
                    hash: this.hash // 抽奖 hash
                }]), {
                    callback: this.nebpay_address,
                    listener: (transaction) => {
                        let hash = transaction.txhash

                        self.join_loading = true
                        self.join_hash = hash

                        this.get_join()
                    }
                })
            },
            get_join: function () {
                // 检查 Join 是否成功

                this.join_loading = true
                this.join_message = null

                if (this.join_request) {
                    this.join_request.cancel("hash change")
                }
                this.join_request = axios.CancelToken.source()

                axios.post(`${this.nebpay_address}/v1/user/getTransactionReceipt`, {
                    hash: this.join_hash
                }, {cancelToken: this.join_request.token}).then((response) => {
                    let data = response.data.result

                    if (data.status === 1) {
                        // 交易完成，重新获取信息

                        this.get_lottery_detail()
                    } else if (data.status === 2) {
                        // 正在交易

                        setTimeout(this.get_join, 1000)
                    } else if (!data.status) {
                        // 交易失败

                        this.join_message = "参与抽奖失败"
                        this.join_loading = false
                    }
                }).catch((error) => {
                    this.join_message = "获取参与抽奖信息失败"
                    this.join_loading = false
                })
            }
        },
        mounted: function () {
            this.get_lottery()
        },
        destroyed: function () {
            clearInterval(this.timer)
        }
    }
</script>
