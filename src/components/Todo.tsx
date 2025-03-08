import DeleteIcon from "../assets/icon-cross.svg";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "../styles/todo.css";
import { useRef, useState } from "react";

interface Todos {
  id: number;
  text: string;
  isCompleted: boolean;
}

interface TodoProps {
  id: number;
  text: string;
  isCompleted: boolean;
  todoList: Todos[];
  setTodoList: React.Dispatch<React.SetStateAction<Todos[]>>;
}

const Todo = ({ text, id, isCompleted, todoList, setTodoList }: TodoProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });
  const [isChecked, setIsChecked] = useState<boolean>(isCompleted);
  const deleteRef = useRef<HTMLImageElement>(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDelete = () => {
    const newTodoList = todoList.filter((todo) => todo.id !== id);

    setTodoList(newTodoList);
    localStorage.setItem("todolist", JSON.stringify(newTodoList));
  };

  const handleChange = (checkbox: HTMLInputElement) => {
    if (checkbox.checked) {
      const newTodo = {
        id: id,
        text: text,
        isCompleted: true,
      };

      const newTodoList = todoList.map((todo) =>
        todo.id === id ? newTodo : todo
      );
      setIsChecked(true);
      setTodoList(newTodoList);
      localStorage.setItem("todolist", JSON.stringify(newTodoList));
    } else {
      const newTodo = {
        id: id,
        text: text,
        isCompleted: false,
      };

      const newTodoList = todoList.map((todo) =>
        todo.id === id ? newTodo : todo
      );
      setIsChecked(false);
      setTodoList(newTodoList);
      localStorage.setItem("todolist", JSON.stringify(newTodoList));
    }
  };

  const handleMouseEnter = () => {
    if (window.innerWidth >= 600 && deleteRef.current)
      deleteRef.current.classList.add("todo_wrapper_image--show");
  };

  const handleMouseLeave = () => {
    if (window.innerWidth >= 600 && deleteRef.current)
      deleteRef.current.classList.remove("todo_wrapper_image--show");
  };

  return (
    <section
      className="todo_wrapper"
      ref={setNodeRef}
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...attributes}
      {...listeners}
    >
      <section className="todo_wrapper_content">
        <input
          type="checkbox"
          name="todoCheckbox"
          checked={isCompleted ?? false}
          className="todo_wrapper_checkbox"
          onChange={(e) => handleChange(e.target)}
          onPointerDown={(e) => e.stopPropagation()}
        />
        <p className={isChecked ? "p--linethrough" : ""}>{text}</p>
      </section>

      <img
        src={DeleteIcon}
        alt="DeleteButton"
        className="todo_wrapper_delete"
        onClick={handleDelete}
        ref={deleteRef}
        onPointerDown={(e) => e.stopPropagation()}
      />
    </section>
  );
};

export default Todo;
