import {
  AuthContainer,
  AuthInputContainer,
  AuthButton,
  AuthLinkText,
  AuthLink,
} from 'components/common/auth.styled';

import { ACLogoIcon } from 'assets/images';
import { AuthInput } from 'components';
import { useState, useEffect } from 'react';
// 註冊/登入成功後自動跳轉頁面
// 使用react-router-dom 提供的 React Hook —— useNavigate
// 可以直接在函式中實現頁面跳轉。
import { useNavigate } from 'react-router-dom';

// 串接註冊功能 追加以下
import Swal from 'sweetalert2';
// import { register, checkPermission } from '../api/auth';
// 改用成以下
import { useAuth } from '../contexts/AuthContext'; // 引用封裝好的資訊

const SignUpPage = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // 基本的使用方式為：
  const navigate = useNavigate();

  const { register, isAuthenticated } = useAuth();

  // 串接註冊功能 追加以下
  const handleClick = async () => {
    if (userName.length === 0) {
      return;
    }
    if (password.length === 0) {
      return;
    }
    if (email.length === 0) {
      return;
    }

    // const { success, authToken } = await register({
    const success = await register({
      userName,
      email,
      password,
    });

    // navigate(Path, { ... });
    // 第一個參數帶入路徑，第二個參數可視情況帶入設定項。

    if (success) {
      // localStorage.setItem('authToken', authToken);
      Swal.fire({
        position: 'top',
        title: '註冊成功！',
        timer: 1000,
        icon: 'success',
        showConfirmButton: false,
      });
      // navigate('/todos');
      return;
    }
    Swal.fire({
      position: 'top',
      title: '註冊失敗！',
      timer: 1000,
      icon: 'error',
      showConfirmButton: false,
    });
  };

  // useEffect(() => {
  //   const checkTokenIsValid = async () => {
  //     const authToken = localStorage.getItem('authToken');
  //     if (!authToken) {
  //       return;
  //     }
  //     const result = await checkPermission(authToken);
  //     if (result) {
  //       navigate('/todos');
  //     }
  //   };

  //   checkTokenIsValid();
  // }, [navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/todos');
    }
  }, [navigate, isAuthenticated]);

  return (
    <AuthContainer>
      <div>
        <ACLogoIcon />
      </div>
      <h1>建立您的帳號</h1>

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
          label={'Email'}
          value={email}
          placeholder={'請輸入 email'}
          onChange={(emailInputValue) => setEmail(emailInputValue)}
        />
      </AuthInputContainer>

      <AuthInputContainer>
        <AuthInput
          type="password"
          label="密碼"
          value={password}
          placeholder="請輸入密碼"
          onChange={(passwordInputValue) => setPassword(passwordInputValue)}
        />
      </AuthInputContainer>
      <AuthButton onClick={handleClick}>註冊</AuthButton>
      <AuthLink to="/login">
        <AuthLinkText>取消</AuthLinkText>
      </AuthLink>
    </AuthContainer>
  );
};

export default SignUpPage;
