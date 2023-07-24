import {
  AuthContainer,
  AuthInputContainer,
  AuthButton,
  AuthLinkText,
  AuthLink,
} from 'components/common/auth.styled';

import { ACLogoIcon } from 'assets/images';
import { AuthInput } from 'components';
import { useState } from 'react';
// 註冊/登入成功後自動跳轉頁面
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import Swal from 'sweetalert2';

const LoginPage = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  // 非同步操作，需要加上 async/await
  const handleClick = async () => {
    // 用判斷式排除 username 和 password 長度為 0 的狀況，若為空值則 return 離開
    if (userName.length === 0) {
      return;
    }
    if (password.length === 0) {
      return;
    }
    // 調用 login() 並傳入表單資料 username 和 password
    const { success, authToken } = await login({
      userName,
      password,
    });
    // 使用 success 屬性來判斷是否登入成功
    if (success) {
      // 成功代表我們已獲得 authToken，
      // 可用 localStorage.setItem('authToken', authToken) 將資料存入 localStorage 裡
      localStorage.setItem('authToken', authToken);

      // 新增使用者提示訊息 使用 sweetalert2
      // 登入成功訊息
      // 頁面掛載 Swal
      Swal.fire({
        // position = 出現位置
        position: 'top',
        // title = 標題文字
        title: '登入成功！',
        // timer = 自動消失時間
        timer: 1000,
        // icon = 登入樣式
        icon: 'success',
        // showConfirmButton = 是否顯示按鈕
        showConfirmButton: false,
      });
      navigate('/todos');
      return;
    }

    // 登入失敗訊息
    Swal.fire({
      position: 'top',
      title: '登入失敗！',
      timer: 1000,
      icon: 'error',
      showConfirmButton: false,
    });
  };

  return (
    <AuthContainer>
      <div>
        <ACLogoIcon />
      </div>
      <h1>登入 Todo</h1>

      <AuthInputContainer>
        <AuthInput
          label={'帳號'}
          value={userName}
          placeholder={'請輸入帳號'}
          onChange={(nameInputValue) => setUserName(nameInputValue)}
        />
      </AuthInputContainer>

      <AuthInputContainer>
        <AuthInput
          // type = 輸入框的類型 ("password"=會自動隱藏密碼)
          type="password"
          // label = 輸入框上顯示的標籤文字
          label={'密碼'}
          // value = 使用者輸入的值
          value={password}
          // placeholder = 沒有輸入前預設顯示內容
          placeholder={'請輸入密碼'}
          // onChange 來偵測使用者輸入值，若偵測到輸入事件就將當前的 value 傳遞給父層。
          onChange={(passwordInputValue) => setPassword(passwordInputValue)}
        />
      </AuthInputContainer>
      <AuthButton onClick={handleClick}>登入</AuthButton>
      <AuthLink to="/signup">
        <AuthLinkText>註冊</AuthLinkText>
      </AuthLink>
    </AuthContainer>
  );
};

export default LoginPage;
