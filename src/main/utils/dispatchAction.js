const { getWindow } = require('../windowManager')


//obj ={key:'addLog',value:'xxx'}
module.exports = (obj) => {
    //找到主进程
    const win = getWindow()
    if (win?.webContents) {
        const webContents = win?.webContents
        webContents.send("dispatchAction", obj);
    }
};