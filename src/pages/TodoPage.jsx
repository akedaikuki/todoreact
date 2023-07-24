import { Footer, Header, TodoCollection, TodoInput } from 'components';
import { useState, useEffect } from 'react';
// 新增如下串接API
// import { useEffect } from 'react';
import { getTodos, createTodo, patchTodo, deleteTodo } from '../api/todos';
import { useNavigate } from 'react-router-dom';
// import { checkPermission } from '../api/auth';
// 改成以下
import { useAuth } from '../contexts/AuthContext'; // 引用封裝好的資訊

// const dummyTodos = [
//   {
//     title: 'Learn react-router',
//     isDone: true,
//     id: 1,
//   },
//   {
//     title: 'Learn to create custom hooks',
//     isDone: false,
//     id: 2,
//   },
//   {
//     title: 'Learn to use context',
//     isDone: true,
//     id: 3,
//   },
//   {
//     title: 'Learn to implement auth',
//     isDone: false,
//     id: 4,
//   },
// ];

const TodoPage = () => {
  // 設置一個變數 inputValue，用來捕捉最新的資料狀態
  const [inputValue, setInputValue] = useState('');
  //
  const [todos, setTodos] = useState([]);

  const navigate = useNavigate();

  // 加入 currentMember
  const { isAuthenticated, currentMember } = useAuth(); // 取出需要的狀態與方法

  // 設置事件處理器 handleInput，接住子層傳來的 onChange
  // 使用setInputValue 更新資料狀態
  const handleInput = (value) => {
    setInputValue(value);
  };

  // 新增Todo項目
  const handleAddTodo = async () => {
    // if (inputValue.trim().length === 0) {
    //   return;
    // }
    // 修改為以下
    if (inputValue.length === 0) {
      return;
    }
    // 新增以下 搭配createTodo
    try {
      // await語法糖需搭配 async function
      const data = await createTodo({
        title: inputValue,
        isDone: false,
      });
      setTodos((prevTodos) => {
        return [
          ...prevTodos,
          // { id: Math.random() * 100, title: inputValue, isDone: false },
          // 修改為以下
          {
            id: data.id,
            title: data.title,
            isDone: data.isDone,
            isEdit: false,
          },
        ];
      });
      setInputValue('');
    } catch (error) {
      console.error(error);
    }
  };
  // 輸入Todo
  const handleKeyDowm = async () => {
    if (inputValue.length === 0) {
      return;
    }
    // 新增以下 搭配createTodo
    try {
      const data = await createTodo({
        title: inputValue,
        isDone: false,
      });
      setTodos((prevTodos) => {
        return [
          ...prevTodos,
          // {
          //   id: Math.random() * 100,
          //   title: inputValue,
          //   isDone: false,
          // },
          {
            id: data.id,
            title: data.title,
            isDone: data.isDone,
            isEdit: false,
          },
        ];
      });
      setInputValue('');
    } catch (error) {
      console.error(error);
    }
  };

  // 切換Todo樣式
  const handleToggleDone = async (id) => {
    // 新增以下 對應 patchTodo
    // 使用陣列操作 find，用 id 查找出當下要 toggle 的項目，並存在 currentTodo 裡
    const currentTodo = todos.find((todo) => todo.id === id);
    try {
      await patchTodo({
        id,
        isDone: !currentTodo.isDone,
      });
      setTodos((prevTodos) => {
        return prevTodos.map((todo) => {
          if (todo.id === id) {
            return {
              ...todo,
              isDone: !todo.isDone,
            };
          }
          return todo;
        });
      });
    } catch (error) {
      console.error(error);
    }
  };
  // 儲存編輯Todo項目
  const handleSave = async ({ id, title }) => {
    // 新增以下
    // 用 patchTodo 修改資料
    try {
      await patchTodo({
        id,
        title,
      });
      setTodos((prevTodos) => {
        return prevTodos.map((todo) => {
          if (todo.id === id) {
            return {
              ...todo,
              // id,
              title,
              isEdit: false,
            };
          }
          return todo;
        });
      });
    } catch (error) {
      console.error(error);
    }
  };

  // 切換Todo編輯模式
  const handleChangeMode = ({ id, isEdit }) => {
    setTodos((prevTodos) => {
      return prevTodos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            isEdit: isEdit,
          };
        }
        return { ...todo, isEdit: false };
      });
    });
  };
  // 刪除Todo項目
  const handleDeleteTodo = async (id) => {
    // 新增以下
    // try...catch...用來錯誤處理
    try {
      await deleteTodo(id);
      // 使用陣列操作 filter，用 id 選出要刪除的項目
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  // 新增useEffect 取得後端資料。
  useEffect(() => {
    const getTodosAsync = async () => {
      try {
        const todos = await getTodos();
        setTodos(todos.map((todo) => ({ ...todo, isEdit: false })));
      } catch (error) {
        console.error(error);
      }
    };
    getTodosAsync();
  }, []);

  // useEffect(() => {
  //   const checkTokenIsValid = async () => {
  //     const authToken = localStorage.getItem('authToken');
  //     if (!authToken) {
  //       navigate('/login');
  //     }
  //     const result = await checkPermission(authToken);
  //     if (!result) {
  //       navigate('/login');
  //     }
  //   };

  //   checkTokenIsValid();
  // }, [navigate]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate, isAuthenticated]);

  return (
    <div>
      TodoPage
      <Header
        // Header：帶入登入使用者名稱
        username={currentMember?.name}
      />
      <TodoInput
        inputValue={inputValue}
        onChange={handleInput}
        onAddTodo={handleAddTodo}
        onKeyDown={handleKeyDowm}
      />
      <TodoCollection
        todos={todos}
        onSave={handleSave}
        onToggleDone={handleToggleDone}
        onChangeMode={handleChangeMode}
        // 追加刪除項目
        onDelete={handleDeleteTodo}
      />
      <Footer
        // 追加項目數
        numTodos={todos.length}
      />
    </div>
  );
};

export default TodoPage;
