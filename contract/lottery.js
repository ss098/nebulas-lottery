"use strict"

let LotteryInstance = function (data) {
    if (data) {
        data = JSON.parse(data)

        let keys = Object.keys(data)

        for (let key of keys) {
            this[key] = data[key]
        }
    }
}
let UserLotteryInstance = LotteryInstance

// 定义抽奖合约
let LotteryContract = function () {
    // 定义抽奖列表
    LocalContractStorage.defineMapProperty(this, "lottery", {
        parse: function (data) {
            return new LotteryInstance(data)
        },
        stringify: function (data) {
            return JSON.stringify(data)
        }
    })
    // 我的抽奖列表
    LocalContractStorage.defineMapProperty(this, "user_lottery", {
        parse: function (data) {
            return new UserLotteryInstance(data)
        },
        stringify: function (data) {
            return JSON.stringify(data)
        }
    })
}

LotteryContract.prototype = {
    init: () => {},

    // 获取抽奖详情
    get: function (hash) {
        // hash 是创建抽奖的 transaction hash
        return {
            lottery: this.lottery.get(hash),
            transaction: Blockchain.transaction
        }
    },

    // 创建抽奖
    create: function ({address, reward, message, count}) {
        const hash = Blockchain.transaction.hash
        const from = Blockchain.transaction.from

        const lottery = {
            address: address, // 允许参与抽奖的地址列表
            count: parseInt(count), // 总可参与抽奖的人数，人满即可开奖
            reward: reward, // 奖励列表，具有 name，count 属性
            message: message, // 发布者提供的备注消息
            join_address: {}, // 已经参与的地址列表

            create_address: from, // 创建合约者
            force_lottery: false, // 是否已经强制开奖
        }

        this.lottery.set(hash, lottery)

        // 获取用户抽奖列表
        let user_lottery = this.user_lottery.get(from)

        if (user_lottery) {
            user_lottery = Object.values(user_lottery)

            user_lottery.push(hash)
        } else {
            user_lottery = [hash]
        }

        this.user_lottery.set(from, user_lottery)

        return lottery
    },

    // 参与抽奖
    join: function ({hash, name}) {
        const from = Blockchain.transaction.from
        const transaction_hash = Blockchain.transaction.hash

        let lottery = this.lottery.get(hash)

        if (lottery.force_lottery) {
            // 已强制开奖

            return {success: false, code: 1}
        } else if (Object.keys(lottery.join_address).length >= lottery.count) {
            // 参与人数已满

            return {success: false, code: 2}
        } else if (lottery.address.length > 0 && lottery.address.indexOf(from) === -1) {
            // 限制了参与抽奖的地址

            return {success: false, code: 3}
        } else if (Object.hasOwnProperty(from)) {
            // 已参与抽奖

            return {success: false, code: 4}
        } else {
            // 正常

            lottery.join_address[from] = {
                hash: transaction_hash,
                name: name // 参与者所自定义的名称
            }

            this.lottery.set(hash, lottery)
        }

        return lottery
    },

    // 强制开奖
    force_lottery: function (hash) {
        const from = Blockchain.transaction.from
        let lottery = this.lottery.get(hash)

        // 未强制开奖且人数未满，申请者是抽奖创建者，则设为强制开奖
        if (!lottery.force_lottery && lottery.count > Object.keys(lottery.join_address).length && lottery.create_address === from) {
            lottery.force_lottery = true

            this.lottery.set(hash, lottery)

            return lottery
        } else {
            return {success: false}
        }
    },

    // 获取用户的抽奖列表
    user_lottery: function () {
        const from = Blockchain.transaction.from

        return this.user_lottery.get(from)
    }
}

module.exports = LotteryContract
