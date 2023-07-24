import styled from 'styled-components';

// 實作登出功能
// import { useNavigate } from 'react-router-dom';
// 修改為以下
import { useAuth } from 'contexts/AuthContext';

const StyledFooter = styled.footer`
  display: flex;
  justify-content: space-between;

  padding: 0 16px;
  p {
    font-size: 14px;
    font-weight: 300;
    margin: 2rem 0 1rem;
  }
`;

const StyledButton = styled.button`
  padding: 0;
  border: 0;
  background: none;
  vertical-align: baseline;
  appearance: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  cursor: pointer;
  outline: 0;

  font-size: 14px;
  font-weight: 300;
  margin: 2rem 0 1rem;
  &:hover {
    text-decoration: underline;
  }
`;

const Footer = ({ numTodos }) => {
  // 實作登出功能
  // 登入的概念是：
  // 目前在專案中，判斷是否「登入」的依據是 localStorage 裡的 authToken
  // 因此，「登出」，就是把 localStorage 裡的 authToken 直接清掉
  // 如此一來，之後在發送請求時，因為沒有攜帶憑證，無法通過後端驗證，就等同於登出
  // const navigate = useNavigate();
  // 修改為以下
  const { logout } = useAuth();

  const handleClick = () => {
    // 使用 localStorage.removeItem移除 authToken
    // localStorage.removeItem('authToken');
    // 引用 useNavigate，將頁面導回登入頁
    // navigate('/login');
    // 修改為以下
    logout();
  };
  return (
    <StyledFooter>
      <p>
        剩餘項目數：
        {/* 修改剩餘項目數 */}
        {numTodos}
      </p>
      <StyledButton onClick={handleClick}>登出</StyledButton>
    </StyledFooter>
  );
};

export default Footer;
