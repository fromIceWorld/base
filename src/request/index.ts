import http from '../http';
function getMenus() {
    return http('menus', {
        url: 'menus',
        method: 'get',
        data: {},
    });
}
export { getMenus };
