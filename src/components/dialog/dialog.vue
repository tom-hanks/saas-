<template>
    <div id='saasDialog'>
        <div class="dialog_content">
            <div class="dialog_logo">
                <p v-html="html"></p>
            </div>
            
        </div>
    </div>
</template>
<script>
export default {
    name:"saasDialog",
    props:{
        html:"",
    },
    data(){
        return{
        }
    },
    mounted(){},
    methods:{}
}
</script>
<style scoped lang="less">
    #saasDialog{
        width: 100%;
        height: 100%;
        position: fixed;
        background: rgba(0, 0, 0, 0.4);
        top:0;
        left: 0;
        z-index: 100;
        .dialog_content{
            width: 320px;
            height: 180px;
            background: #fff;
            margin: 0 auto;
            margin-top: 260px;
            border-radius: 8px;
            .dialog_logo{
                padding-top: 100px;
                width: 100%;
                background: url(../../assets/images/images/editOver.png) no-repeat center 35px; 
                background-size: 36px 36px;
                p{
                    text-align: center;
                }
            }
        }
    }
</style>

    