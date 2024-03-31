import PlusIcon from '@mui/icons-material/Add';
import { useMemo, useState } from "react";

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

import { Column, Id, Task } from "../../interfaces/types";
import { defaultCols, defaultTasks } from "../../utils/data";
import { ColumnContainer, TaskCard } from "..";
import { Box, IconButton, SxProps } from '@mui/material';


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

const KanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>(defaultCols);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const [tasks, setTasks] = useState<Task[]>(defaultTasks);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const createTask = (columnId: Id) => {
    const newTask: Task = {
      id: generateId(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    };
  
    setTasks([...tasks, newTask]);
  };
  
  const deleteTask = (id: Id) => {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  };
  
  const updateTask = (id: Id, content: string) => {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });
  
    setTasks(newTasks);
  };
  
  const createNewColumn = () => {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };
  
    setColumns([...columns, columnToAdd]);
  };
  
  const deleteColumn = (id: Id) => {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);
  
    const newTasks = tasks.filter((t) => t.columnId !== id);
    setTasks(newTasks);
  };
  
  const updateColumn = (id: Id, title: string) => {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });
  
    setColumns(newColumns);
  };
  
  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }
  
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  };
  
  const onDragEnd = (event: DragEndEvent) => {
    setActiveColumn(null);
    setActiveTask(null);
  
    const { active, over } = event;
    if (!over) return;
  
    const activeId = active.id;
    const overId = over.id;
  
    if (activeId === overId) return;
  
    const isActiveAColumn = active.data.current?.type === "Column";
    if (!isActiveAColumn) return;
  
    console.log("DRAG END");
  
    setColumns((columns) => {
      const activeColumnIndex: number = columns.findIndex((col) => col.id === activeId);
  
      const overColumnIndex: number = columns.findIndex((col) => col.id === overId);
  
      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  };
  
  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
  
    const activeId = active.id;
    const overId = over.id;
  
    if (activeId === overId) return;
  
    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";
  
    if (!isActiveATask) return;
  
    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);
  
        if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
          // Fix introduced after video recording
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }
  
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }
  
    const isOverAColumn = over.data.current?.type === "Column";
  
    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
  
        tasks[activeIndex].columnId = overId;
        console.log("DROPPING TASK OVER COLUMN", { activeIndex });
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  };

  return (
    <Box sx={ kanbanBoardStyle.mainKanbanContainer} >
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <Box sx={ kanbanBoardStyle.header} >
          
          <Box sx={ kanbanBoardStyle.hearderSortableContext}>
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                />
              ))}
            </SortableContext>
          </Box>

          <IconButton onClick={() => createNewColumn()} sx={kanbanBoardStyle.iconButtonStyle}>
            <PlusIcon />
            Add Column
          </IconButton>
        </Box>

        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </Box>
  );
  
}

function generateId() {
  /* Generate a random number between 0 and 10000 */
  return Math.floor(Math.random() * 10001);
}

export default KanbanBoard;