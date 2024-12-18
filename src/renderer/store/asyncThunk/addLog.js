import { setLogList, setLocalLogList } from '../modules/testStatus'
import { nanoid } from 'nanoid';
import Moment from 'moment';
import { throttle } from 'lodash';
import { addLogRendererToMain } from '@/utils';
const maxLogs = 300;
const throttleSetLocalLogList = throttle((dispatch, logList) => {
    const list = logList.slice(0, 50);
    dispatch(setLocalLogList(list));
}, 300, { leading: true, trailing: true });

export default (payload) => {
    return async (dispatch, getState) => {
        const rootState = getState();
        const tempLogList = rootState.testStatus.logList;
        // 拷贝现有日志数组
        const logList = [...tempLogList];
        const payloadArr = payload.split('_-_');
        const type = payloadArr.length === 1 ? 'info' : payloadArr[0]
        let level = 'info'
        switch (type) {
            case 'success':
                level = 'info';
                break;
            case 'warning':
                level = 'warn';
                break;
        }
        const message = payloadArr.length === 1 ? payloadArr[0] : payloadArr[1]
        addLogRendererToMain({ level, msg: message })
        const newPayload = {
            id: nanoid(8),
            createDate: Moment().format('YYYY-MM-DD HH:mm:ss'),
            type,
            message,
        };
        logList.unshift(newPayload);
        if (logList?.length > maxLogs) {
            logList.pop();
        }
        // 更新日志列表
        dispatch(setLogList(logList));
        throttleSetLocalLogList(dispatch, logList);
    };
};
