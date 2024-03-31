import { SortableContext, useSortable } from "@dnd-kit/sortable";
import TrashIcon from '@mui/icons-material/Delete';
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import PlusIcon from '@mui/icons-material/Add';

import { Column, Id, Task } from "../../interfaces/types";
import { TaskCard } from "..";
import { SxProps } from "@mui/material";

export interface styledKanbanBoar {
  mainKanbanContainer: SxProps;
  header: SxProps;
  hearderSortableContext: SxProps;
  iconButtonStyle: SxProps;
}

const kanbanBoardStyle: styledKanbanBoar = {
  mainKanbanContainer:{
    margin: 'auto',
    display: 'flex',
    minHeight: '100vh',
    width: '100%',
    alignItems: 'center',
    overflowX: 'auto',
    overflowY: 'hidden',
    paddingLeft: '40px',
    '@media screen and (max-width: 440px)': {
      
    },
  },
  header:{
    display: 'flex',
    gap: '4px',
    margin: 'auto',
    '@media screen and (max-width: 440px)': {
      
    },
  },
  hearderSortableContext:{
    display: 'flex',
    gap: '4px',
  },
  iconButtonStyle:{
    height: '60px',
    width: '350px',
    minWidth: '350px',
    cursor: 'pointer',
    borderRadius: '8px', // Equivalent to rounded-lg
    backgroundColor: '#0D1117', // Assuming mainBackgroundColor is '#0D1117'
    border: '2px solid #161C22', // Assuming columnBackgroundColor is '#161C22'
    padding: '16px', // Equivalent to p-4
    boxShadow: '0 0 0 3px #F0C419', // Equivalent to ring-rose-500
    '&:hover': {
      boxShadow: '0 0 0 2px #F0C419' // Equivalent to hover:ring-2
    },
    display: 'flex', // Equivalent to flex
    gap: '8px' // Equivalent to gap-2
  }
}

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;

  createTask: (columnId: Id) => void;
  updateTask: (id: Id, content: string) => void;
  deleteTask: (id: Id) => void;
  tasks: Task[];
}

const ColumnContainer:React.FC<Props> =({ column, deleteColumn, updateColumn, createTask, tasks, deleteTask, updateTask }) => {
  const [editMode, setEditMode] = useState(false);

  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
      bg-columnBackgroundColor
      opacity-40
      border-2
      border-pink-500
      w-[350px]
      h-[500px]
      max-h-[500px]
      rounded-md
      flex
      flex-col
      "
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="
  bg-columnBackgroundColor
  w-[350px]
  h-[500px]
  max-h-[500px]
  rounded-md
  flex
  flex-col
  "
    >
      {/* Column title */}
      <div
        {...attributes}
        {...listeners}
        onClick={() => {
          setEditMode(true);
        }}
        className="
      bg-mainBackgroundColor
      text-md
      h-[60px]
      cursor-grab
      rounded-md
      rounded-b-none
      p-3
      font-bold
      border-columnBackgroundColor
      border-4
      flex
      items-center
      justify-between
      "
      >
        <div className="flex gap-2">
          <div
            className="
        flex
        justify-center
        items-center
        bg-columnBackgroundColor
        px-2
        py-1
        text-sm
        rounded-full
        "
          >
            0
          </div>
          {!editMode && column.title}
          {editMode && (
            <input
              className="bg-black focus:border-rose-500 border rounded outline-none px-2"
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              autoFocus
              onBlur={() => {
                setEditMode(false);
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          )}
        </div>
        <button
          onClick={() => {
            deleteColumn(column.id);
          }}
          className="
        stroke-gray-500
        hover:stroke-white
        hover:bg-columnBackgroundColor
        rounded
        px-1
        py-2
        "
        >
          <TrashIcon />
        </button>
      </div>

      {/* Column task container */}
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>
      {/* Column footer */}
      <button
        className="flex gap-2 items-center border-columnBackgroundColor border-2 rounded-md p-4 border-x-columnBackgroundColor hover:bg-mainBackgroundColor hover:text-rose-500 active:bg-black"
        onClick={() => {
          createTask(column.id);
        }}
      >
        <PlusIcon />
        Add task
      </button>
    </div>
  );
}

export default ColumnContainer;