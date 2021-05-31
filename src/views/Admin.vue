<template>
  <div id="admin">
    <div id="nav">
      <router-link tag="div" class="navlink" to="/admin/addProduct">
        <p>Ürün Ekleme</p>
      </router-link>
      <router-link tag="div" class="navlink" to="/admin/addImage">
        <p>Resim Ekleme</p>
      </router-link>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
  
#admin {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  height: 100vh;

}
#nav {
  box-sizing: content-box;
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
  height: 6vh;
  width: 100%;
  background-color: rgb(0, 180, 200);
  margin: 0;
  padding: 0;
  font-size: 2vh;
  font-weight: 700;
  font-family: Arial, Helvetica, sans-serif;
  color: #2c3e50;
}

.navlink {
  position: relative;
  box-sizing: content-box;
  height: 100%;
  width: fit-content;
  padding-inline: 1.2vh;
  display: inline-flex;
  justify-content: center;
  align-items:center;
  margin-block: 0.2vmax;
  cursor: pointer;
  margin-inline: 1vmax;

}
.navlink p{
  margin-block: 0.8vmax;
}

.router-link-active{
  box-shadow: 0vmax 0vmax 1vmax -0.1vmax black;
  border-radius: 1vmax;
  height:80%;
  align-items: center;
}
</style>
