<template>
    <div class="container">
        <section class="section">
            <div class="columns is-centered">
                <div class="column is-three-quarters">
                    <article class="content">
                        <p>抽奖是一个星云链（Nebulas）下的去中心化应用（DApp），用以解决抽奖过程中所产生的的信任问题：</p>
                        <blockquote>
                            <strong>
                                如何遵循公开、公平、公正的原则，完成一次抽奖？
                            </strong>
                        </blockquote>
                        <p>我们都知道，传统的抽奖系统数据全部来自单点服务器，这也意味着其中存在人为操作空间，甚至还有公司年会 CTO 现场组织程序员对抽奖程序代码审查（Code Review）的事件传出。</p>
                        <p>而抽奖给出了一个解决方案，确保每个参与者在活动中都是平等的：</p>
                        <ul>
                            <li>
                                公开（<strong>分布式</strong>）数据以公开且分布式的形式存储
                            </li>
                            <li>
                                公平（<strong>随机性</strong>）使用随机产生的交易哈希来计算
                            </li>
                            <li>
                                公正（<strong>可验算</strong>）使用抽奖数据离线也可验算结果
                            </li>
                        </ul>
                        <p>最终的抽奖结果来自去中心化的智能合约（Smart Contract）所公开在区块链上的数据（如交易哈希，Transaction Hash）进行组合运算（也可以自定义算法），同样的输入数据使用同一种算法得到的抽奖结果相同，所有人都可以在本地离线验算抽奖结果。</p>
                        <p>而与抽奖相关的所有代码都是开源的，这样就可以得到使所有参与者信服抽奖结果，在技术上满足了<strong>年会抽奖</strong>、<strong>购车摇号</strong>等场景。</p>
                    </article>
                </div>
            </div>
        </section>
    </div>
</template>
