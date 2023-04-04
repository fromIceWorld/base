// store.js
import { reactive, ref } from 'vue';

export const store = reactive({
    dataSource: ref([
        {
            id: 1,
            tagName: 'my-test',
            appName: 'test',
            label: '告警管理',
            icon: 'icon-suyuan',
            children: [
                {
                    id: 9,
                    label: '交互式研判',
                    tagName: 'judge',
                    icon: 'icon-judge',
                    children: [
                        {
                            id: 99,
                            label: '溯源管理',
                            icon: 'icon-suyuan',
                            tagName: 'suyuan',
                            children: [
                                {
                                    id: 999,
                                    label: '追踪溯源',
                                    tagName: 'zhuizong',
                                    icon: 'icon-suyuan',
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 10,
                    label: '研判策略',
                    tagName: 'celve',
                    icon: 'icon-hailiangxiansuo',
                },
            ],
        },
        {
            id: 2,
            label: '来源可信度',
            tagName: 'my-demo',
            icon: 'icon-wangzhankexindu',
            children: [
                {
                    id: 5,
                    label: '设备可信度',
                    tagName: 'shebei',
                    icon: 'icon-wangzhankexindu',
                },
            ],
        },
        {
            id: 3,
            label: '威胁研判',
            tagName: 'celvesdds',
            icon: 'icon-wangzhankexindu',
            children: [
                {
                    id: 7,
                    label: '现象线索管理',
                    tagName: 'celsdsvesdds',
                    icon: 'icon-wangzhankexindu',
                },
            ],
        },
        {
            id: 121,
            label: '人员管理',
            tagName: 'celvesewewdds',
            icon: 'icon-suyuan',
            children: [
                {
                    id: 7432,
                    label: '现象线索管理',
                    tagName: 'celsdsvesdewds',
                    icon: 'icon-wangzhankexindu',
                },
            ],
        },
    ]),
});
