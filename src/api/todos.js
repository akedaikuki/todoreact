// 使用 Axios 套件 發送API請求給後端伺服器
import axios from 'axios';

// 網址中的共用部分
// const baseUrl = 'http://localhost:3001';
// 重構 如以下
const baseUrl = 'https://todo-list.alphacamp.io/api';

const axiosInstance = axios.create({
  baseURL: baseUrl,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    // 如果 token 存在的話，就透過 config.headers 來設定 headers，並回傳 config
    // key 使用 Authorization
    // value 使用 Bearer 前綴，並帶上 token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  // 發送請求失敗的話，使用 arrow function 讓錯誤訊息印出
  (error) => {
    console.error(error);
  },
);

// 串接 API：預覽 新增 編輯 刪除
// 預覽Todos
export const getTodos = async () => {
  // 使用try{ }...catch(error){ } 來確認登入是否成功
  try {
    const res = await axiosInstance.get(`${baseUrl}/todos`);
    return res.data;
  } catch (error) {
    console.error('[Get Todos failed]: ', error);
  }
};
// 新增Todo
export const createTodo = async (payload) => {
  const { title, isDone } = payload;
  try {
    const res = await axiosInstance.post(`${baseUrl}/todos`, {
      title,
      isDone,
    });
    return res.data;
  } catch (error) {
    console.error('[Create Todo failed]: ', error);
  }
};
// 編輯Todo
export const patchTodo = async (payload) => {
  const { id, title, isDone } = payload;
  try {
    const res = await axiosInstance.patch(`${baseUrl}/todos/${id}`, {
      title,
      isDone,
    });
    return res.data;
  } catch (error) {
    console.error('[Patch Todo failed]:', error);
  }
};
// 刪除Todo
export const deleteTodo = async (id) => {
  try {
    const res = await axiosInstance.delete(`${baseUrl}/todos/${id}`);
    return res.data;
  } catch (error) {
    console.error('[Delete Todo failed]:', error);
  }
};
