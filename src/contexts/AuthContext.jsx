import { createContext, useState, useEffect } from 'react'; // 追加 useEffect
import { login, register, checkPermission } from 'api/auth'; // 追加 checkPermission
import * as jwt from 'jsonwebtoken';
// 要偵測「路徑是否變化」，則可以運用 react-router-dom 提供的 useLocation 方法，
// 這個方法可以取得瀏覽器網址列中的路徑資訊
import { useLocation } from 'react-router-dom'; //追加 useLocation
// 在 App 層掛載 AuthProvider
import { useContext } from 'react';

const defaultAuthContext = {
  isAuthenticated: false, // 使用者是否登入的判斷依據，預設為 false，若取得後端的有效憑證，則切換為 true
  currentMember: null, // 當前使用者相關資料，預設為 null，成功登入後就會有使用者資料
  register: null, // 註冊方法
  login: null, // 登入方法
  logout: null, // 登出方法
};

const AuthContext = createContext(defaultAuthContext);

// 用 export 匯出要讓外部元件取用的內容，並自行封裝一個 useAuth，
// 用函式回傳 useContext(AuthContext)
// 之後在其他元件只要匯入 useAuth 就能取用這個 Context 的內容
export const useAuth = () => useContext(AuthContext);

// 建立 AuthProvider 來管理狀態，並封裝會影響到身分狀態的註冊、登入、登出方法，
// 它會回傳一個可讓子元件共用的 <AuthContext.Provider>

export const AuthProvider = ({ children }) => {
  //  是否已獲得授權
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  //  等下會從 authToken 裡解析出使用者資料，放進 currentMember
  const [payload, setPayload] = useState(null);
  //  追加 偵測「路徑是否變化」
  const { pathname } = useLocation();
  //  一旦 pathname 有改變，就需要重新驗證 token，因此需要使用 useEffect，
  //  而 dependency 參數需要設定為 pathname
  useEffect(() => {
    const checkTokenIsValid = async () => {
      // 使用 localStorage.getItem('authToken') 拿出最新的 token
      const authToken = localStorage.getItem('authToken');
      // 如果 authToken 不存在，代表身分驗證未通過
      if (!authToken) {
        setIsAuthenticated(false);
        setPayload(null);
        return;
      }
      // 如果 authToken 存在，呼叫 checkPermission(authToken) 檢查有效性
      const result = await checkPermission(authToken);
      // 若驗證成功
      if (result) {
        setIsAuthenticated(true);
        // 用 jwt.decode 取出使用者資訊，並 setPayload()
        const tempPayload = jwt.decode(authToken);
        setPayload(tempPayload);
      } else {
        // 若驗證無效
        setIsAuthenticated(false);
        setPayload(null);
      }
    };

    checkTokenIsValid();
  }, [pathname]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        // 解析 JWT Token 後，從 payload 中取得的登入使用者資料
        // 進一步拿出 payload 中的 sub 和 name，作為使用者的 id 和 name
        currentMember: payload && {
          id: payload.sub,
          name: payload.name,
        },
        // 註冊方法
        register: async (data) => {
          const { success, authToken } = await register({
            username: data.username,
            email: data.email,
            password: data.password,
          });
          // 透過 jwt.decode 來解析 authToken
          const tempPayload = jwt.decode(authToken);
          // 代表登入是有效的
          if (tempPayload) {
            // 先 setPayload 存進 Context 的內部狀態
            // 同時 isAuthenticated 改成 true
            setPayload(tempPayload);
            setIsAuthenticated(true);
            localStorage.setItem('authToken', authToken);
          } else {
            setPayload(null);
            setIsAuthenticated(false);
          }
          return success;
        },
        // 登入方法
        login: async (data) => {
          const { success, authToken } = await login({
            username: data.username,
            password: data.password,
          });
          const tempPayload = jwt.decode(authToken);
          if (tempPayload) {
            setPayload(tempPayload);
            setIsAuthenticated(true);
            localStorage.setItem('authToken', authToken);
          } else {
            setPayload(null);
            setIsAuthenticated(false);
          }
          return success;
        },
        // 登出方法
        logout: () => {
          localStorage.removeItem('authToken');
          setPayload(null);
          setIsAuthenticated(false);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 接著我們會在 Context 裡實作註冊、登入、登出方法，實作完成以後，
// 會取代掉在 SignUpPage、LoginPage、TodoPage 的流程。
