// store.js
import { reactive, ref } from 'vue';

export const store = reactive({
    dataSource: ref([
        {
            id: 1,
            url: 'hello',
            label: '告警管理',
            icon: 'icon-suyuan',
            children: [
                {
                    id: 9,
                    label: '交互式研判',
                    url: 'judge',
                    icon: 'icon-judge',
                    children: [
                        {
                            id: 99,
                            label: '溯源管理',
                            icon: 'icon-suyuan',
                            url: 'suyuan',
                            children: [
                                {
                                    id: 999,
                                    label: '追踪溯源',
                                    url: 'zhuizong',
                                    icon: 'icon-suyuan',
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 10,
                    label: '研判策略',
                    url: 'celve',
                    icon: 'icon-hailiangxiansuo',
                },
            ],
        },
        {
            id: 2,
            label: '来源可信度',
            url: 'kexindu',
            icon: 'icon-wangzhankexindu',
            children: [
                {
                    id: 5,
                    label: '设备可信度',
                    url: 'shebei',
                    icon: 'icon-wangzhankexindu',
                },
            ],
        },
        {
            id: 3,
            label: '威胁研判',
            url: 'celvesdds',
            icon: 'icon-wangzhankexindu',
            children: [
                {
                    id: 7,
                    label: '现象线索管理',
                    url: 'celsdsvesdds',
                    icon: 'icon-wangzhankexindu',
                },
            ],
        },
        {
            id: 121,
            label: '人员管理',
            url: 'celvesewewdds',
            icon: 'icon-suyuan',
            children: [
                {
                    id: 7432,
                    label: '现象线索管理',
                    url: 'celsdsvesdewds',
                    icon: 'icon-wangzhankexindu',
                },
            ],
        },
    ]),
    increment() {
        this.count++;
    },
});
