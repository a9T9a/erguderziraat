<template>
    <div id="announcement">
        <p class="head">Duyurular</p>
        <hr>
        <div class="container">
            <p>İşbankası çiftçi kredileri onaylandı</p>
            <p>Yeni Ürünler Geldi</p>
            <p>Çilek aşılama zamanı yaklaşıyor</p>
            <p>Zeytin toplama zamanı geldi</p>
            <p>Üzüm dalları</p>
        </div>
    </div>    
</template>

<script>
export default {
    
}
</script>

<style scoped>
    #announcement{
        box-sizing: border-box;
        margin: 1vmax;
        height: 28.5vmax;
        width: 35vmax;
        /*background-color: rgb(240, 250, 240);*/
        background-color: rgba(17, 54, 20, 0.8);
        color: white;
        border-radius: 0.5vmax;
        box-shadow:  0 0.5vmax 1vmax -0.1vmax rgb(120, 120, 120);
        box-shadow:  0 0.5vmax 1vmax -0.1vmax black;
        padding: 1vmax;
    }

    .container{
        margin-top: 1.5vmax ;
        text-align: left;
        font-size: 1vmax;
        font-weight: 400;
        text-decoration-style: dotted;
        text-emphasis-color: black;
    }

    .head{
        font-size: 1.5vmax;
        text-align: left;
        margin: 0;
        color:rgba(226, 134, 69, 1)
    }

    @media screen and (max-width: 768px){
        #announcement{
            width: 100%;
            margin-inline: 0;
        }

        .head{
            font-size: 3vmax;
        }

        .container{
            font-size: 1.7vmax;
        }
    }
</style>