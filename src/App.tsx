import BackgroundImageDarkL from "./assets/bg-desktop-dark.jpg";
import BackgroundImageDark from "./assets/bg-mobile-dark.jpg";
import BackgroundImageLightL from "./assets/bg-desktop-light.jpg";
import BackgroundImageLight from "./assets/bg-mobile-light.jpg";
import TodoList from "./components/TodoList";
import Header from "./components/Header";
import { useEffect, useState } from "react";
import "./App.css";

interface Todos {
  id: number;
  text: string;
  isCompleted: boolean;
}

function App() {
  const localStoredTodolist = localStorage.getItem("todolist");
  const localStoredTheme = localStorage.getItem("theme");
  const [theme, setTheme] = useState<string>(
    localStoredTheme ? localStoredTheme : "dark"
  );
  const [activeTab, setActiveTab] = useState<string>("All");
  const [todoList, setTodoList] = useState<Todos[]>(
    localStoredTodolist !== null ? JSON.parse(localStoredTodolist) : []
  );
  const [filterTodos, setFilterTodos] = useState<Todos[]>(todoList);

  useEffect(() => {
    document.documentElement.classList.remove("light-theme", "dark-theme");
    document.documentElement.classList.add(
      theme === "dark" ? "dark-theme" : "light-theme"
    );
  }, [theme]);

  useEffect(() => {
    const filterTodo = () => {
      if (activeTab === "All") {
        setFilterTodos(todoList);
      } else if (activeTab === "Active") {
        const filteredTodos = todoList.filter(
          (todo) => todo.isCompleted === false
        );
        setFilterTodos(filteredTodos);
      } else if (activeTab === "Completed") {
        const filteredTodos = todoList.filter(
          (todo) => todo.isCompleted === true
        );
        setFilterTodos(filteredTodos);
      }
    };
    filterTodo();
  }, [activeTab, todoList]);

  const handleTabChange = (e: React.MouseEvent<HTMLLIElement>) => {
    const tab = e.currentTarget.textContent as string;
    setActiveTab(tab);
  };

  return (
    <main className="_main">
      <section className="_main_content">
        {theme === "dark" ? (
          <picture>
            <source srcSet={BackgroundImageDarkL} media="(min-width: 720px)" />
            <img
              className="_main_header_image"
              src={BackgroundImageDark}
              alt="BackgroundImage"
            />
          </picture>
        ) : (
          <picture>
            <source srcSet={BackgroundImageLightL} media="(min-width: 720px)" />
            <img
              className="_main_header_image"
              src={BackgroundImageLight}
              alt="BackgroundImage"
            />
          </picture>
        )}
        <Header
          todoList={todoList}
          setTodoList={setTodoList}
          Theme={theme}
          setTheme={setTheme}
        />
        <TodoList
          todoList={todoList}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setTodoList={setTodoList}
          filterTodos={filterTodos}
          setFilterTodos={setFilterTodos}
        />

        <ul className="_main_filterbar">
          <li
            className={activeTab === "All" ? "_main_filterbar--active" : ""}
            onClick={(e) => handleTabChange(e)}
          >
            All
          </li>
          <li
            className={activeTab === "Active" ? "_main_filterbar--active" : ""}
            onClick={(e) => handleTabChange(e)}
          >
            Active
          </li>
          <li
            className={
              activeTab === "Completed" ? "_main_filterbar--active" : ""
            }
            onClick={(e) => handleTabChange(e)}
          >
            Completed
          </li>
        </ul>

        <p className="_main_feature_alert">Drag and Drop to reoder list</p>
      </section>
    </main>
  );
}

export default App;
