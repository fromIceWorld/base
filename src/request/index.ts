import http from '../http';
function getMenus() {
    return http('systemMenus', {
        method: 'get',
        data: {},
    });
}
function getPages(tagName: string) {
    return http('page', {
        method: 'get',
        params: {
            tagName,
        },
    });
}
function getComponents() {
    return http('component', {
        method: 'get',
    });
}
function saveMenu(params: any) {
    return http('saveMenu', {
        method: 'post',
        data: params,
    });
}
export { getMenus, getPages, getComponents, saveMenu };
