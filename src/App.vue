<script  lang="ts" setup>
import { ref } from 'vue'
import {store} from './store.js'
import {getMenus} from './request/index'
import { onMounted } from 'vue'

import HelloWorld from './components/HelloWorld.vue';
interface Tree {
  id: number
  label: string
  icon?: string
  url?: string
  children?: Tree[]
}
const components=[HelloWorld]
const isCollapse = ref(false)
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

let secondMenus:any = ref([]);
const handleSelect = (e)=>{
  let nextMenu = store.dataSource.filter((item:any)=>item.url == e);
  secondMenus.value = nextMenu[0].children
}
const getMenu = ()=>{
  getMenus().then(res=>{
    console.log(res)
  })
}
onMounted(() => {
  getMenu()
})
</script>

<template>
    <div class="container">
      <!-- 应用表 -->
        <div class="header">
          <div class="logo">
            logo
          </div>
          <div style="flex:1">
            <el-menu
             :router="true"
              class="el-first-menu"
              mode="horizontal"
              background-color="#545c64"
              text-color="#fff"
              default-active="hello"
              active-text-color="#ffd04b"
              @select="handleSelect"
            >
            <el-menu-item v-for="menu of store.dataSource" :key="menu.id" :index="String(menu.url)">
              <el-icon>
                <span class="iconfont" :class='menu.icon'></span>
              </el-icon>
              {{menu.label}}
            </el-menu-item>
          </el-menu>
        </div>

        </div>
        <div class="body">
          <div class="menu">
            <div class="menu-expend">
              <el-icon v-show="isCollapse"  @click="isCollapse = false"><Expand /></el-icon>
              <el-icon  v-show="!isCollapse"  @click="isCollapse = true"><Fold /></el-icon>
            </div>
            <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
              <el-radio-button :label="false">expand</el-radio-button>
              <el-radio-button :label="true">collapse</el-radio-button>
            </el-radio-group> -->
            <el-menu
                active-text-color="#ffd04b"
                background-color="#545c64"
                text-color="#fff"
                default-active="2"
                class="el-menu-vertical-demo my-menu"
                :collapse="isCollapse"
                @open="handleOpen"
                @close="handleClose"
              >
              <template v-for="(menu, index) in secondMenus" :key="menu.id" >
                <!-- 二级菜单集合 -->
                <el-sub-menu v-show="menu.children && menu.children.length"  :index="String(index)">
                    <template #title >
                      <el-icon>
                        <span class="iconfont" :class='menu.icon'></span>
                      </el-icon>
                      <span>{{ menu.label }}</span>
                    </template>
                    <template v-for="child of menu.children" :key="child.id">
                      <!-- 有三级菜单 -->
                      <template v-if="child.children && child.children.length >0">
                        <el-menu-item-group :key="child.id" :title="child.label">
                          <template v-if="child.children && child.children.length>0">
                            <el-menu-item v-for="child2 of child.children" :key="child2.id"  :index="String(child2.id)">
                              <template #title >
                                <el-icon>
                                  <span class="iconfont" :class='child2.icon'></span>
                                </el-icon>
                                <span>{{ child2.label }}</span>
                              </template>
                            </el-menu-item>
                          </template>
                        </el-menu-item-group>
                      </template>
                      <!-- 无三级菜单 -->
                      <template v-if="!child.children || child.children.length == 0">
                        <el-menu-item :index="String(child.id)">
                          <template #title >
                              <el-icon>
                                <span class="iconfont" :class='child.icon'></span>
                              </el-icon>
                              <span>{{ child.label }}</span>
                            </template>
                        </el-menu-item>
                      </template>
                    </template>
                </el-sub-menu>
                <!-- 二级独立菜单 -->
                <el-menu-item v-show="!menu.children || menu.children.length == 0" :index="String(menu.id)">
                      <el-icon>
                        <span class="iconfont" :class='menu.icon'></span>
                      </el-icon>
                      <span>{{ menu.label }}</span>
                </el-menu-item>
              </template>              
              </el-menu>
          </div>
          <div class="content">
            <router-view></router-view>
            <hello-world></hello-world>
          </div>
        </div>
        <div class="footer"></div>
    </div>
</template>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.el-first-menu{
  flex: 1;
}
.logo{
  width: 200px
}
.my-menu {
  height: calc(100vh - 60px);
}
body{
  padding: 0;
  margin: 0;
}
.menu-expend{
  position: absolute;
    right: 0;
    top: 0;
    z-index: 2;
}
.body{
  display: flex;
}
.menu{
  position: relative;
}
.content{
  flex: 1;
}
.header {
  background-color: #545c64;
  display: flex;
  height: 60px;
  line-height: 1.5;
}


</style>
