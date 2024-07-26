module.exports = {
    devServer: {
        proxy: {
            '^/store': {
                target: 'http://localhost:3000',
                changOrigin: true, //如果接口跨域这里就要这个参数配置
            },
        },
    },
};
