import './App.scss';
import { HomePage, LoginPage, SignUpPage, TodoPage } from './pages';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
// 在 App 層掛載 AuthProvider
import { AuthProvider } from 'contexts/AuthContext';

// 讓 <AuthProvider> 包住所有元件，如此一來子元件就可以取用 Context 的共享內容
// 但需要放在 <BrowserRouter> 裡面，因為我們在 AuthProvider 裡有使用到瀏覽器的資訊

const basename = process.env.PUBLIC_URL;

function App() {
  return (
    <div className="app">
      <BrowserRouter basename={basename}>
        <AuthProvider>
          <Routes>
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignUpPage />} />
            <Route path="todo" element={<TodoPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}
export default App;
