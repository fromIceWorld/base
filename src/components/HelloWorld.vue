<script lang="ts" setup>

import { ElMessageBox,ElMessage } from 'element-plus'
import {store} from '../store.js'
import {getComponents,saveMenu} from '../request/index'

import { ref,onMounted } from 'vue'
import type Node from 'element-plus/es/components/tree/src/model/node'
import {
  Check,
  Delete,
  Edit,
  Message,
  Search,
  Star,
} from '@element-plus/icons-vue'
import 'element-plus/dist/index.css';
import type { DragEvents } from 'element-plus/es/components/tree/src/model/useDragNode'
import type {
  AllowDropType,
  NodeDropType,
} from 'element-plus/es/components/tree/src/tree.type'

const handleDragStart = (node: Node, ev: DragEvents) => {
  console.log('drag start', node)
}
const handleDragEnter = (
  draggingNode: Node,
  dropNode: Node,
  ev: DragEvents
) => {
  console.log('tree drag enter:', dropNode.label)
}
const handleDragLeave = (
  draggingNode: Node,
  dropNode: Node,
  ev: DragEvents
) => {
  console.log('tree drag leave:', dropNode.label)
}
const handleDragOver = (draggingNode: Node, dropNode: Node, ev: DragEvents) => {
  console.log('tree drag over:', dropNode.label)
}
const handleDragEnd = (
  draggingNode: Node,
  dropNode: Node,
  dropType: NodeDropType,
  ev: DragEvents
) => {
  console.log('tree drag end:', dropNode && dropNode.label, dropType)
}
const handleDrop = (
  draggingNode: Node,
  dropNode: Node,
  dropType: NodeDropType,
  ev: DragEvents
) => {
  console.log('tree drop:', dropNode.label, dropType)
}
const allowDrop = (draggingNode: Node, dropNode: Node, type: AllowDropType) => {
  if (dropNode.data.label === 'Level two 3-1') {
    return type !== 'inner'
  } else {
    return true
  }
}
const allowDrag = (draggingNode: Node) => {
  return !draggingNode.data.label.includes('Level three 3-1-1')
}


let selectNode = ref({});

interface Tree {
  id: number
  label: string
  icon?: string
  children?: Tree[]
}
let id = 1000
const edit = (data)=>{
  const {label:labelValue,url:urlValue,tagName:tagNameValue,icon:iconValue} = data;
  label.value = labelValue;
  url.value = urlValue;
  component.value = tagNameValue;
  icon.value = iconValue

  selectNode.value = data
  dialogVisible.value = true;

  console.log(data)
}
const append = (data: Tree) => {
  console.log(data);
  selectNode.value = data
  dialogVisible.value = true;
}
const deepLevel2Url = (obj:any,tag:string,path:any[])=>{
  const {tagName,children,url} = obj;
  if(tagName == tag){

  }

}
const remove = (node: Node, data: Tree) => {
  console.log(node,data)
  const parent = node.parent
  const children: Tree[] = parent.data.children || parent.data
  const index = children.findIndex((d) => d.id === data.id)
  children.splice(index, 1);
  saveSystemMenu()
}

let dialogVisible = ref(false)
const handleClose = (done: () => void) => {
  ElMessageBox.confirm('Are you sure to close this dialog?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}
// 配置参数
let label = ref('');
let url = ref('');
let icon = ref('');
const component = ref('');
const emit = defineEmits(['change']);
const createNode = ()=>{
  let data =  selectNode;
  const newChild = {
    url:url, 
    pre:data.value.pre + '/' + url.value, 
    label: label,
    tagName:component.value,
    icon:icon.value, 
    children: [] }
  if (!data.value.children) {
    data.value.children = []
  }
  data.value.children.push(newChild);
  console.log(data)
  dialogVisible.value = false;
  saveSystemMenu()
}
const componentList = ref([]);
const getComponentList = ()=>{
  getComponents().then((res:any)=>{
    const {code,data} = res;
    if(code == 200){
      componentList.value = data || []
    }
    console.log(res)
  })
}
onMounted(() => {
  getComponentList();
})
const colorsLevel = ['','#F56C6C','#67C23A','#409EFF','#E6A23C',]
const icons = ['icon-suyuan','icon-hailiangxiansuo','icon-gaojing','icon-judge','icon-wangzhankexindu']
let selectIcon = (e)=>{
  icon.value = e
}
const saveSystemMenu = ()=>{
  saveMenu({menus:store.dataSource}).then(res=>{
    console.log('保存菜单',res)
    ElMessage({
    message: '修改菜单成功.',
    type: 'success',
  })
  })
}
</script>

<template>
  <el-button type="success" size="small" :icon="Check" circle @click="saveSystemMenu"/>
 <el-tree
    :allow-drop="allowDrop"
    :allow-drag="allowDrag"
    :data="store.dataSource"
    draggable
    show-checkbox
    node-key="id"
    default-expand-all
    :expand-on-click-node="false"
    @node-drag-start="handleDragStart"
    @node-drag-enter="handleDragEnter"
    @node-drag-leave="handleDragLeave"
    @node-drag-over="handleDragOver"
    @node-drag-end="handleDragEnd"
    @node-drop="handleDrop"
    >
    <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span class="iconfont" :class='node.data.icon'></span>
          <span :style="{color: colorsLevel[node.level]}">{{ node.label }}</span>
          <span class="operation">
            <a @click="append(data)"> <el-icon :color="'green'"><Plus></Plus></el-icon> </a>
            <a @click="edit(data)"> <el-icon :color="'#e6a23c'"><Edit></Edit></el-icon> </a>
            <a @click="remove(node, data)"> <el-icon :color="'red'"><Delete /></el-icon> </a>
          </span>
        </span>
      </template>
 </el-tree>
   <el-dialog
    v-model="dialogVisible"
    title="添加菜单页面"
    width="30%"
    :close-on-click-modal= 'false'
  >
    <div>
      <div class="config">
        <div class="config-label">label:</div>
        <el-input style="flex: 1;" v-model="label" placeholder="请输入 label"> 
        </el-input>
      </div>
      <div class="config">
        <div class="config-label">url:</div>
        <el-input style="flex: 1;" v-model="url" placeholder="请输入 url">
          <template #prepend>{{ selectNode.pre }}/</template>
        </el-input>
      </div>
      <div class="config">
        <div class="config-label">component:</div>
        <el-select v-model="component" class="m-2" placeholder="Select">
          <el-option
            v-for="item in componentList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="config icon-config">
        <div class="config-label">icon:</div>
        <div>
          <span v-for="i of icons" 
            class="iconfont" 
            :class="i" 
            :key="i" 
            @click="selectIcon(i)"
            :style="{color:i == icon ? 'red' : 'black'}">
        </span>
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">
          取消
        </el-button>
        <el-button @click="createNode">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style>

.icon:hover{
  color: var(--el-button-text-color);
}
.config{
  margin-bottom: 10px;
}
.config-label{
  font-size: 15px;
    color: #F56C6C;
    font-weight: 600;
    margin-bottom: 3px;
}
.icon-config .iconfont{
  border: 1px solid #dcdfe6;
  cursor: pointer;
  padding: 2px;
}
.icon-config .iconfont:hover{
  color: red !important;
}

.custom-tree-node .operation{
    display:none;
}
.operation a{
  margin-left: 3px;

}
.custom-tree-node:hover .operation{
    display:block;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  font-size: 14px;
  padding-right: 8px;
}
.custom-tree-node span:nth-child(2){
  position: relative;
  left: 6px;
}
.custom-tree-node span:nth-child(3){
  position: relative;
  top: 2px;
  left: 12px;
}
.icon{
  padding: 0;
    height: 12px;
    border: none;
}
.icon:hover {
    color: unset;
}
</style>
