<template>
    <div class="spinner">
        <div class="rect1"></div>
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
        <div class="rect5"></div>
    </div>
</template>
<style scoped>
    .spinner {
        margin: 4em auto;
        width: 4em;
        height: 2em;
        text-align: center;
    }

    .spinner > div {
        background-color: #333;
        height: 100%;
        width: 6px;
        display: inline-block;

        animation: sk-stretchdelay 1.2s infinite ease-in-out;
    }

    .spinner .rect2 {
        animation-delay: -1.1s;
    }

    .spinner .rect3 {
        animation-delay: -1.0s;
    }

    .spinner .rect4 {
        animation-delay: -0.9s;
    }

    .spinner .rect5 {
        animation-delay: -0.8s;
    }


    @keyframes sk-stretchdelay {
        0%, 40%, 100% {
            transform: scaleY(0.4);
        }
        20% {
            transform: scaleY(1.0);
        }
    }
</style>
