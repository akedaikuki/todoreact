// 引用 axios
import axios from 'axios';

const authURL = 'https://todo-list.alphacamp.io/api/auth';

// 實作登入方法
export const login = async ({ username, password }) => {
  try {
    // 定義串接的 end point 網址為
    const { data } = await axios.post(`${authURL}/login`, {
      username,
      password,
    });
    // 先觀察後端回傳的 API 格式，若後端認證成功，
    // 會回傳 authToken 和登入使用者資料，
    const { authToken } = data;
    // 我們運用 authToken 的有無來設計條件式：
    // 若 authToken 存在就代表登入成功，就回傳資料以便後續利用。
    // 在回傳資料時，一併整理資料格式，加上 success 屬性做為 flag，
    // 之後就能用 success 屬性來判斷是否登入成功。
    if (authToken) {
      return { success: true, ...data };
    }
    return data;
  } catch (error) {
    console.error('[Login Failed]:', error);
  }
};

// 註冊方式
export const register = async ({ username, email, password }) => {
  try {
    const { data } = await axios.post(`${authURL}/register`, {
      username,
      email,
      password,
    });
    const { authToken } = data;

    if (authToken) {
      return { success: true, ...data };
    }

    return data;
  } catch (error) {
    console.error('[Register Failed]: ', error);
  }
};
