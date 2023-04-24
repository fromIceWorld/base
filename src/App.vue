<script  lang="ts" setup>
import { ref } from 'vue'
import {store} from './store.js'
import {getMenus,getPages} from './request/index'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

import HelloWorld from './components/HelloWorld.vue';
interface Tree {
  id: number
  label: string
  icon?: string
  tagName?: string
  children?: Tree[]
}
const components=[HelloWorld]
const isCollapse = ref(false)
const router  = useRouter()
const handleOpen = (key: string, keyPath: string[]) => {
  // 路由跳转
  router.push(key)
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

let secondMenus:any = ref([]);
// 菜单事件
const handleSelect = (index:string,keyPath:string,routeResult:any)=>{
  console.log('选中菜单',index,keyPath,routeResult)
  let nextMenu = store.dataSource.filter((item:any)=>item.pre + '/' + item.url == index);
  const {tagName,pre,children,url} = nextMenu[0];
  menuLevel1.value = pre + '/' + url;
  secondMenus.value = children;
  // getPage(tagName);
  // 选中第一个
  expendMenu2(nextMenu[0])
}
const handleLevel2Select = (index:string,keyPath:string,routeResult:any)=>{
  console.log('选中菜单',index,keyPath,routeResult);
  let tagName = getTargetTagName(secondMenus.value,index);
  console.log('tagName',tagName)
  router.push(index)

  // let nextMenu = store.dataSource.filter((item:any)=>item.tagName == index);
  // secondMenus.value = nextMenu[0].children;
  getPage(tagName)
}
const getTargetTagName = (menus:any[] = [],index:string):string=>{
  for(let menu of menus){
    const {pre,tagName,children,url} = menu;
    if(index == pre + '/' + url){
      return tagName;
    }else{
      let tag =  getTargetTagName(children,index);
      if(tag){
        return tag
      }
    }
  }
  return ''
}
let cacheScript = new Set();
const getPage = (tagName)=>{
  getPages(tagName).then((res:any)=>{
    let  {code ,data} = res;
    if(code == 200){
      if(!data){
        data = {}
      }
      let {appName,component,script={},tagName} =data;
      console.log(appName,component,script,tagName)
      //@ts-ignore
      let area = document.querySelector('app-child'),targetApp;
      area!.childNodes.forEach(child=>{
        if(!tagName || child.tagName !== tagName.toLocaleUpperCase()){
          child.style.display = 'none'
        }else{
          child.style.display = 'unset'
          targetApp = child;
        }
      })
      if(targetApp){
        return 
      }else{
        if(tagName){
          area!.append(document.createElement(tagName));
        }
      }
      
      let doms:any[] = [];
      let dep = [];
        for (let [src, decorator] of Object.entries(script)) {
          if(cacheScript.has(JSON.stringify({src, decorator}))){
            continue
          }
          cacheScript.add(JSON.stringify({src, decorator}));
        // if(doms.length == 6){
        //   console.log(doms)
        //   continue
        // }
          let dom:any;
          if (src.endsWith('.js')) {
              dom = document.createElement('script');
              dom.src = 'pull/' + src;
              Object.keys(decorator).forEach((key) => {
                  dom[key] = decorator[key];
              });
          } else if (src.endsWith('.css')) {
              dom = document.createElement('link');
              dom.href = 'pull/' +  src;
              dom.rel = 'stylesheet';
          }
          dep.push(
              new Promise((resolve, reject) => {
                  dom.addEventListener('load', () => {
                      resolve(src);
                  });
              })
          );
          doms.push(dom);
          document.head.append(dom);
      }
      if(!tagName){
        return
      }

      let comScript = document.createElement('script');
      comScript.src = 'pull/'  + component.src;
      Promise.all(dep).then((res) => {
        console.log('加载资源完毕')
          document.head.append(comScript);
      });
      }
    console.log(res)
  })
}

const getMenu = ()=>{
  getMenus().then((res:any)=>{
    const {code,data} = res;
    if(code == 200){
      store.dataSource = data;
      data.forEach((child:any,index:number)=>{
        if(index == 0){
          const {url,children} = child;
          menuLevel1.value = '/' + url;
          secondMenus.value = children
        }
        deepTagMenu(child,'');
      })
      expendMenu2(data[0])

    }
  })
}
const menuLevel1 = ref('/test');
const menuLevel2 = ref('');
const deepTagMenu = (item:any,pre:string)=>{
  const {url,children} = item;
  item['pre'] =pre;
  (children || []).forEach((child:any)=>{
    deepTagMenu(child,pre + '/' + url)
  })
}
onMounted(() => {
  getMenu();
})
const expendMenu2 = (child:any)=>{
  [child].forEach((menu1:any)=>{
    const {pre,children,url} = menu1;
    if(pre + '/' + url == menuLevel1.value){
      // secondMenus = children;
      // 选中二级
      const {pre:index,tagName} = deepSelectMenu(menu1)
      console.log('选中：',index)
      menuLevel2.value =  index;
      getPage(tagName);
      router.push(index)
    }
  })
}
const deepSelectMenu = (item:any):any=>{
  const {pre,url,tagName,children} = item;
  if(!children || children.length == 0){
    return {pre:pre + '/' + url,tagName};
  }else{
    return deepSelectMenu(children[0])
  }
}
</script>

<template>
    <div class="container">
      <!-- 应用表 -->
        <div class="header">
          <div class="logo">
            {{menuLevel1}}  {{ menuLevel2 }}
          </div>
          <div style="flex:1">
            <el-menu
              class="el-first-menu"
              mode="horizontal"
              background-color="#545c64"
              text-color="#fff"
              :default-active="menuLevel1"
              active-text-color="#ffd04b"
              @select="handleSelect"
            >
            <el-menu-item v-for="menu of store.dataSource" :key="menu.tagName" :index="menu.pre + '/' + menu.url">
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
                class="el-menu-vertical-demo my-menu"
                :collapse="isCollapse"
                :default-active="menuLevel2"
                @open="handleOpen"
                @close="handleClose"
                @select="handleLevel2Select"
              >
              <template v-for="(menu) in secondMenus" :key="menu.tagName" >
                <!-- 二级菜单集合 -->
                <el-sub-menu v-show="menu.children && menu.children.length"  :index="menu.pre + '/' + menu.url">
                    <template #title >
                      <el-icon>
                        <span class="iconfont" :class='menu.icon'></span>
                      </el-icon>
                      <span>{{ menu.label }}</span>
                    </template>
                    <template v-for="child of menu.children" :key="child.tagName">
                      <!-- 有三级菜单 -->
                      <template v-if="child.children && child.children.length >0">
                        <el-menu-item-group :key="child.tagName" :title="child.label">
                          <template v-if="child.children && child.children.length>0">
                            <el-menu-item v-for="child2 of child.children" :key="child2.tagName"  :index="child2.pre + '/' + child2.url">
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
                        <el-menu-item :index="child.pre + '/' + child.url">
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
                <el-menu-item v-show="!menu.children || menu.children.length == 0" :index="menu.pre + '/' + menu.url">
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
            <!-- <hello-world></hello-world> -->
            <app-child></app-child>
          </div>
        </div>
        <div class="footer">
        </div>
    </div>
</template>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: calc(100vh - 60px);;
}
.el-first-menu{
  flex: 1;
}
.logo{
  width: 200px
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
