<template>
    <div class="container">
        <div class="columns is-centered">
            <div class="column is-three-quarters">
                <div class="card">
                    <div class="card-content">
                        <article v-if="message" class="message is-info">
                            <div class="message-body">
                                {{ message }}
                            </div>
                        </article>

                        <div class="field is-horizontal">
                            <div class="field-label is-normal">
                                <label class="label">参与抽奖人数</label>
                            </div>
                            <div class="field-body">
                                <div class="field has-addons">
                                    <p class="control">
                                        <input v-model="lottery.count" class="input is-radiusless" type="number" min="2">
                                    </p>
                                    <p class="control">
                                        <a class="button is-static is-radiusless">
                                            人
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="field is-horizontal">
                            <div class="field-label"></div>
                            <div class="field-body">
                                <div class="control">
                                    <p class="help">达到人数后将自动开奖</p>
                                </div>
                            </div>
                        </div>

                        <div class="field is-horizontal">
                            <div class="field-label is-normal">
                                <label class="label">奖品设置</label>
                            </div>
                            <div class="field-body">
                                <nav class="panel panel-items">
                                    <div v-for="(reward, index) in lottery.reward"
                                         :class="{'panel-block': true, 'is-active': active_reward_index === index, 'item': true}">
                                        <p class="control has-icons-left">
                                            <input @focus="active_reward_index = index" v-model="reward.name"
                                                   spellcheck="false" class="input" type="text"
                                                   placeholder="添加奖项">

                                            <span class="icon is-left">
                                                {{ reward.count }}
                                            </span>

                                            <div class="item-right">
                                                <a @click="$set(reward, 'count', reward.count + 1)"
                                                   class="button is-radiusless">
                                                    <i class="fas fa-plus" aria-hidden="true"></i>
                                                </a>
                                            </div>
                                            <div class="item-right">
                                                <a @click="minus_reward(reward)" class="button is-radiusless">
                                                    <i class="fas fa-minus" aria-hidden="true"></i>
                                                </a>
                                            </div>
                                            <div class="item-right">
                                                <a @click="lottery.reward.splice(index, 1)" class="button is-radiusless">
                                                    <i class="fas fa-trash" aria-hidden="true"></i>
                                                </a>
                                            </div>
                                        </p>
                                    </div>

                                    <a @keydown.enter="add_reward" :class="{'panel-block': true, 'is-active': reward_name}">
                                        <p class="control has-icons-left">
                                            <input @focus="active_reward_index = null" v-model="reward_name"
                                                   spellcheck="false" class="input" type="text"
                                                   placeholder="按回车添加奖项">

                                            <span class="icon is-left">
                                                <i class="fas fa-list-ul" aria-hidden="true"></i>
                                            </span>

                                            <div class="item-right">
                                                <a @click="add_reward" class="button is-radiusless">
                                                    <i class="fas fa-plus" aria-hidden="true"></i>
                                                </a>
                                            </div>
                                        </p>
                                    </a>
                                </nav>
                            </div>
                        </div>

                        <div class="field is-horizontal">
                            <div class="field-label"></div>
                            <div class="field-body">
                                <div class="control">
                                    <p class="help">鼠标悬浮在奖项条目上可以调整数量</p>
                                </div>
                            </div>
                        </div>

                        <div class="field is-horizontal">
                            <div class="field-label is-normal">
                                <label class="label">抽奖说明（可选）</label>
                            </div>
                            <div class="field-body">
                                <textarea v-model="lottery.message" class="textarea"></textarea>
                            </div>
                        </div>

                        <!-- TODO -->
                        <div v-if="false" class="field is-horizontal">
                            <div class="field-label is-normal">
                                <label class="label">限制地址（可选）</label>
                            </div>
                            <div class="field-body">
                                <nav class="panel panel-items">
                                    <div v-for="(address, index) in lottery.address" class="panel-block item">
                                        <p class="control has-icons-left">
                                            <input v-model="lottery.address[index]" spellcheck="false" class="input" type="text"
                                                   placeholder="添加地址">

                                            <span class="icon is-left">
                                                <i class="fas fa-map-marker" aria-hidden="true"></i>
                                            </span>

                                            <div class="item-right">
                                                <a @click="lottery.address.splice(index, 1)" class="button is-radiusless">
                                                    <i class="fas fa-trash" aria-hidden="true"></i>
                                                </a>
                                            </div>
                                        </p>
                                    </div>

                                    <a @keydown.enter="add_address" :class="{'panel-block': true, 'is-active': address_text}">
                                        <p class="control has-icons-left">
                                            <input v-model="address_text" spellcheck="false" class="input" type="text"
                                                   placeholder="按回车添加地址">

                                            <span class="icon is-left">
                                                <i class="fas fa-map-marker" aria-hidden="true"></i>
                                            </span>

                                            <div class="item-right">
                                                <a @click="add_address" class="button is-radiusless">
                                                    <i class="fas fa-plus" aria-hidden="true"></i>
                                                </a>
                                            </div>
                                        </p>
                                    </a>
                                </nav>
                            </div>
                        </div>

                        <div v-if="false" class="field is-horizontal">
                            <div class="field-label"></div>
                            <div class="field-body">
                                <div class="control">
                                    <p class="help">如果填写了地址，则只有指定的钱包地址才能参与抽奖</p>
                                </div>
                            </div>
                        </div>

                        <div class="field is-horizontal">
                            <div class="field-label"></div>
                            <div class="field-body">
                                <div class="control">
                                    <button @click="submit" class="button is-info">提交抽奖</button>
                                </div>
                            </div>
                        </div>

                        <div class="field is-horizontal">
                            <div class="field-label"></div>
                            <div class="field-body">
                                <div class="control">
                                    <p class="help is-danger">抽奖信息所有人皆可查看，请谨慎提交内容。</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data: function () {
            return {
                lottery: {
                    address: [], // 允许参与抽奖的地址列表
                    count: 2, // 总可参与抽奖的人数，人满即可开奖
                    reward: [{name: "iPhone 8 Plus 金色 64G", count: 1}], // 奖励列表，具有 name，count 属性
                    message: "" // 发布者提供的备注消息
                },

                reward_name: "",
                active_reward_index: null,

                address_text: "",

                message: ""
            }
        },
        props: {
            nebpay: null,
            nebpay_address: null,
            contract_address: null
        },
        methods: {
            add_reward: function () {
                if (this.reward_name) {
                    this.lottery.reward.push({
                        name: this.reward_name,
                        count: 1
                    })

                    this.reward_name = ""
                }
            },
            minus_reward: function (reward) {
                if (reward.count > 1) {
                    this.$set(reward, "count", reward.count - 1)
                }
            },
            add_address: function () {
                if (this.address_text) {
                    this.lottery.address.push(this.address_text)
                    this.address_text = ""
                }
            },
            submit: function () {
                const nebpay = this.nebpay
                const self = this

                if (this.lottery.reward.length <= 0) {
                    this.message = "请填写奖品"
                } else {
                    nebpay.call(this.contract_address, 0, "create", JSON.stringify([this.lottery]), {
                        callback: this.nebpay_address,
                        listener: (transaction) => {
                            let hash = transaction.txhash

                            self.$router.push({name: "detail", query: {hash: hash}})
                        }
                    })
                }
            }
        }
    }
</script>
