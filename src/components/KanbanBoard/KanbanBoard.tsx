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

import { Column, Day, Id, Task } from "../../interfaces/types";
import { defaultCols, defaultTasks } from "../../utils/data";
import { ColumnContainer, TaskCard } from "..";
import { Box, Button, IconButton, SxProps } from '@mui/material';


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
    backgroundColor: '#202020', // Assuming mainBackgroundColor is '#0D1117'
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
  changeState: (days:Day[])=> void
  nextStep: ()=> void
}

const KanbanBoard:React.FC<Props> = ({changeState, nextStep}) => {
  const [columns, setColumns] = useState<Column[]>(defaultCols);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const [tasks, setTasks] = useState<Task[]>(defaultTasks);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const [activeTask, setActiveTask] = useState<Task | null>(null);


  const finishSelection = () =>{
    const daysMap: { [key: string]: Day } = {};

    // Inicializamos el mapa de días con objetos Day vacíos
    columns.forEach(column => {
      daysMap[column.id] = {
        id: column.id,
        titleday: column.title,
        timeofday: {
          morning: [],
          afternoon: [],
          night: [],
        },
      };
    });
  
    // Clasificamos las tareas por día y período del día
    tasks.forEach(task => {
      const { time, content, columnId } = task;
      
      if (daysMap[columnId]) {
        switch (time) {
          case 'mañana':
            daysMap[columnId].timeofday.morning.push(content);
            break;
          case 'tarde':
            daysMap[columnId].timeofday.afternoon.push(content);
            break;
          case 'noche':
            daysMap[columnId].timeofday.night.push(content);
            break;
          default:
            break;
        }
      }
    });
  
    // Convertimos el mapa de días en un array de días
    const days: Day[] = Object.values(daysMap);
    changeState(days);
    nextStep();
  }

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
      time:'mañana',
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

  const doubleTask = (id: Id) => {
    const taskToReplicate = tasks.find(task => task.id === id);
    if (taskToReplicate) {
        const newId = generateId().toString(); // Genera un nuevo ID para la tarea replicada
        const replicatedTask = { ...taskToReplicate, id: newId };
        setTasks(prevTasks => [...prevTasks, replicatedTask]);
    }
};

const changePeriodOfDay = (id: Id) => {
  const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      
      let newPeriod;
      switch (task.time) {
          case 'mañana':
              newPeriod = 'tarde';
              break;
          case 'tarde':
              newPeriod = 'noche';
              break;
          case 'noche':
              newPeriod = 'mañana';
              break;
          default:
              newPeriod = task.time; // Si no es ninguno de los valores esperados, mantiene el periodo actual
      }
      
      return { ...task, time: newPeriod };
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
                  doubleTask={doubleTask}
                  changePeriodOfDay={changePeriodOfDay}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                />
              ))}
            </SortableContext>
          </Box>

            <Box sx={{display:'flex', flexDirection:'column', justifyContent:'center'}}>
              
              <IconButton onClick={() => createNewColumn()} sx={kanbanBoardStyle.iconButtonStyle}>
                <PlusIcon />
                Add Column
              </IconButton>

              <Button variant='contained' onClick={() => finishSelection()} sx={kanbanBoardStyle.iconButtonStyle}>
                End
              </Button>

            </Box>

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
                doubleTask={doubleTask}
                changePeriodOfDay={changePeriodOfDay}
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
                doubleTask={doubleTask}
                changePeriodOfDay={changePeriodOfDay}
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
  /* Generate a random number between 0 and 100000 */
  return Math.floor(Math.random() * 100001).toString();
}

export default KanbanBoard;