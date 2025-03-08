import { useRef, useState } from "react";
import ThemeSwitchIconLight from "../assets/icon-moon.svg";
import ThemeSwitchIconDark from "../assets/icon-sun.svg";
import "../styles/header.css";

interface Todo {
  id: number;
  text: string;
  isCompleted: boolean;
}

interface TodoProps {
  todoList: Todo[];
  setTodoList: React.Dispatch<React.SetStateAction<Todo[]>>;
  Theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
}

const Header = ({ todoList, setTodoList, Theme, setTheme }: TodoProps) => {
  const [todo, setTodo] = useState<string>("");
  const todoInput = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const todoObj = {
      id: Date.now(),
      text: todo,
      isCompleted: false,
    };

    setTodo("");
    if (todoInput.current) todoInput.current.value = "";
    setTodoList([...todoList, todoObj]);
    localStorage.setItem("todolist", JSON.stringify([...todoList, todoObj]));
  };

  const handleThemeChange = () => {
    if (Theme == "dark") {
      localStorage.setItem("theme", "light");
      document.documentElement.classList.add("light-theme");
      document.documentElement.classList.remove("dark-theme");
      setTheme("light");
    } else {
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark-theme");
      document.documentElement.classList.remove("light-theme");
      setTheme("dark");
    }
  };

  return (
    <header className="header_wrapper">
      <section className="header_heading">
        <h1>TODO</h1>
        <img
          src={Theme === "dark" ? ThemeSwitchIconDark : ThemeSwitchIconLight}
          alt="ThemeIcon"
          onClick={handleThemeChange}
        />
      </section>

      <form className="todo_form" onSubmit={(e) => handleSubmit(e)}>
        <input type="checkbox" name="todoInput" className="todo_checkbox" />
        <input
          type="text"
          name="todoInput"
          className="todo_input"
          placeholder="Create a new todo..."
          ref={todoInput}
          onChange={(e) => setTodo(e.target.value)}
        />
      </form>
    </header>
  );
};

export default Header;
