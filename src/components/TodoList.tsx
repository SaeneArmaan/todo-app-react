import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Todo from "./Todo";
import "../styles/todolist.css";

interface Todos {
  id: number;
  text: string;
  isCompleted: boolean;
}

interface TodoListProps {
  todoList: Todos[];
  filterTodos: Todos[];
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  setTodoList: React.Dispatch<React.SetStateAction<Todos[]>>;
  setFilterTodos: React.Dispatch<React.SetStateAction<Todos[]>>;
}

const TodoList = ({
  todoList,
  activeTab,
  setActiveTab,
  filterTodos,
  setTodoList,
}: TodoListProps) => {
  const handleTabChange = (e: React.MouseEvent<HTMLLIElement>) => {
    const tab = e.currentTarget.textContent as string;
    setActiveTab(tab);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleClear = () => {
    const newTodoList = todoList.filter((todo) => !todo.isCompleted);
    setTodoList(newTodoList);
    localStorage.setItem("todolist", JSON.stringify(newTodoList));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over !== null && active.id !== over.id) {
      const oldIndex = todoList.findIndex((todo) => todo.id === active.id);
      const newIndex = todoList.findIndex((todo) => todo.id === over.id);

      const newList = arrayMove(todoList, oldIndex, newIndex);
      setTodoList(newList);
      localStorage.setItem("todolist", JSON.stringify(newList));
    }
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={(event) => handleDragEnd(event)}
      >
        <section className="todolist">
          <SortableContext
            items={filterTodos}
            strategy={verticalListSortingStrategy}
          >
            {filterTodos.length !== 0 ? (
              filterTodos.map((todo) => {
                return (
                  <Todo
                    key={todo.id}
                    text={todo.text}
                    id={todo.id}
                    isCompleted={todo.isCompleted}
                    todoList={todoList}
                    setTodoList={setTodoList}
                  />
                );
              })
            ) : (
              <p className="todolist_alert">No Todos</p>
            )}
          </SortableContext>

          <section className="todolist_statusbar">
            <p>{filterTodos.length} items left</p>
            <ul className="todolist_filterbar">
              <li
                className={activeTab === "All" ? "_main_filterbar--active" : ""}
                onClick={(e) => handleTabChange(e)}
              >
                All
              </li>
              <li
                className={
                  activeTab === "Active" ? "_main_filterbar--active" : ""
                }
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
            <p className="todolist_clear" onClick={handleClear}>
              Clear Completed
            </p>
          </section>
        </section>
      </DndContext>
    </>
  );
};

export default TodoList;
