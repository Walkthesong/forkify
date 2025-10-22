import { API_URL } from './config';
import { TIME_SEC } from './config';

//超时函数，当网速过慢时，使promise返回拒绝值，防止fetch无法停止
export const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// export const getJSON = async function (url) {
//   try {
//     const fetchData = fetch(url);
//     const res = await Promise.race([fetchData, timeout(TIME_SEC)]);
//     const data = await res.json();

//     if (!res.ok) throw new Error(`${data.message} (${res.status})`);

//     return data;
//   } catch (err) {
//     //如果只是控制台打印错误信息，那么调用这个函数的函数将收不到真正的错误信息
//     //主动抛出错误，这个错误信息能被catch捕捉到，让用户知道真正的错误在哪里
//     throw err;
//   }
// };

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIME_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};
