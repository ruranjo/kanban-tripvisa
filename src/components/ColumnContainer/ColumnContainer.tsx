import { SortableContext, useSortable } from "@dnd-kit/sortable";

import TrashIcon from '@mui/icons-material/Delete';
import DifferenceIcon from '@mui/icons-material/Difference';
import WhetherIcon from '@mui/icons-material/SettingsSystemDaydream';

import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import PlusIcon from '@mui/icons-material/Add';

import { Column, Id, Task } from "../../interfaces/types";
import { TaskCard } from "..";
import { Box, IconButton, SxProps, TextField } from "@mui/material";

export interface styledColumnContainer {
  dragging: SxProps;
  mainColumnContainer: SxProps;
  header: SxProps;
  counter: SxProps;
  iconButtonStyle: SxProps;
  textField: SxProps;
  columnTaskContainer: SxProps;
}

const columnContainerStyle: styledColumnContainer = {
  dragging:{
    backgroundColor: '#161C22', // Assuming columnBackgroundColor is '#161C22'
    opacity: 0.4,
    border: '2px solid #F0C419', // Assuming pink-500 is '#F0C419'
    width: '350px',
    height: '500px',
    maxHeight: '500px',
    borderRadius: '8px', // Equivalent to rounded-md
    display: 'flex', // Equivalent to flex
    flexDirection: 'column', // Equivalent to flex-col
    '@media screen and (max-width: 440px)': {
      
    },
  },
  mainColumnContainer:{
    backgroundColor: '#161C22', // Assuming columnBackgroundColor is '#161C22'
    width: '350px',
    height: '500px',
    maxHeight: '500px',
    borderRadius: '8px', // Equivalent to rounded-md
    display: 'flex', // Equivalent to flex
    flexDirection: 'column', // Equivalent to flex-col
    '@media screen and (max-width: 440px)': {
      
    },
  },
  header:{
    backgroundColor: '#0D1117', // Assuming mainBackgroundColor is '#0D1117'
    fontSize: '1rem', // Equivalent to text-md
    height: '60px',
    cursor: 'grab',
    borderRadius: '8px', // Equivalent to rounded-md
    borderBottomLeftRadius: '0', // Equivalent to rounded-b-none
    padding: '12px', // Equivalent to p-3
    fontWeight: 'bold', // Equivalent to font-bold
    border: '4px solid #161C22', // Assuming columnBackgroundColor is '#161C22'
    display: 'flex', // Equivalent to flex
    alignItems: 'center', // Equivalent to items-center
    justifyContent: 'space-between', // Equivalent to justify-between
  },
  counter:{
    display: 'flex', // Equivalent to flex
    justifyContent: 'center', // Equivalent to justify-center
    alignItems: 'center', // Equivalent to items-center
    backgroundColor: '#161C22', // Assuming columnBackgroundColor is '#161C22'
    paddingX: '8px', // Equivalent to px-2
    paddingY: '4px', // Equivalent to py-1
    fontSize: '0.875rem', // Equivalent to text-sm
    borderRadius: '9999px', // Equivalent to rounded-full
  },
  iconButtonStyle:{
      display: 'flex', // Equivalent to flex
      gap: '8px', // Equivalent to gap-2
      alignItems: 'center', // Equivalent to items-center
      border: '2px solid #161C22', // Assuming columnBackgroundColor is '#161C22'
      borderRadius: '8px', // Equivalent to rounded-md
      padding: '16px', // Equivalent to p-4
      '&:hover': {
        backgroundColor: '#0D1117', // Assuming mainBackgroundColor is '#0D1117'
        color: '#F0C419', // Assuming rose-500 is '#F0C419'
      },
      '&:active': {
        backgroundColor: 'black', // Equivalent to active:bg-black
      },
    }
  ,
  textField:{
    backgroundColor: 'black', // Equivalent to bg-black
      '&:focus': {
        borderColor: '#F0C419', // Assuming rose-500 is '#F0C419'
      },
      border: '1px solid #161C22', // Assuming border color
      borderRadius: '4px', // Equivalent to rounded
      outline: 'none', // Equivalent to outline-none
      paddingX: '8px', // Equivalent to px-2
  },
  columnTaskContainer:{
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    gap: '16px',
    padding: '8px',
    overflowX: 'hidden',
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      borderRadius: '8px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
  }

}

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;

  createTask: (columnId: Id) => void;
  updateTask: (id: Id, content: string) => void;
  deleteTask: (id: Id) => void;
  doubleTask: (id: Id) => void;
  changePeriodOfDay: (id: Id) => void;
  tasks: Task[];
}

const ColumnContainer:React.FC<Props> =({ column, deleteColumn, updateColumn, createTask, tasks, deleteTask, updateTask, doubleTask, changePeriodOfDay}) => {
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
      <Box
        ref={setNodeRef}
        style={style}
        sx={columnContainerStyle.dragging}
      >
      </Box>
    );
  }

  return (
    <Box sx={columnContainerStyle.mainColumnContainer} ref={setNodeRef} style={style} >
      {/* Column title */}
      <Box sx={columnContainerStyle.header} {...attributes} {...listeners} onClick={() =>  setEditMode(true)}>
        <Box sx={{display: 'flex', gap: '2px' }}>
          <Box sx={columnContainerStyle.counter} >
            {tasks.length}
          </Box>
          {!editMode && column.title}
          {editMode && (
            <TextField
              sx={columnContainerStyle.textField}
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
        </Box>

        <IconButton
          onClick={() => {
            deleteColumn(column.id);
          }}
          sx={{
            stroke: '#A0AEC0', // Equivalent to stroke-gray-500
            '&:hover': {
              stroke: '#FFF', // Equivalent to hover:stroke-white
              backgroundColor: '#161C22', // Assuming columnBackgroundColor is '#161C22'
            },
            borderRadius: '4px', // Equivalent to rounded
            paddingX: '4px', // Equivalent to px-1
            paddingY: '8px', // Equivalent to py-2
          }}
        >
          <TrashIcon />
        </IconButton>

      </Box>

      {/* Column task container */}
      <Box sx={columnContainerStyle.columnTaskContainer}>
        <SortableContext items={tasksIds}>
          {tasks.map((task, indice) => (
            <Box sx={{display:'flex', flexDirection:'column'}} key={indice} >
            <Box sx={{display:'flex',width:'40%', borderRadius:'20px 20px 0px 0px', backgroundColor:'#202020', border:'2px solid #0D1117'}}>
              <IconButton
                sx={{}}
                onClick={() => {
                  deleteTask(task.id);
                }}
                
              >
                <TrashIcon  />
              </IconButton>
              
            
              <IconButton
                sx={{}}
                onClick={() => {
                  doubleTask(task.id);
                }}
                
              >
                <DifferenceIcon />
              </IconButton>
              
            
              
              <IconButton
                sx={{}}
                onClick={() => {
                  changePeriodOfDay(task.id);
                }}
                
              >
                <WhetherIcon />
              </IconButton>
          </Box>
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
              doubleTask={doubleTask}
              changePeriodOfDay={changePeriodOfDay}
            />
            
        
            </Box>
            
          ))}
        </SortableContext>
      </Box>
      {/* Column footer */}
      <IconButton
        sx={columnContainerStyle.iconButtonStyle}
        
        onClick={() => {
          createTask(column.id);
        }}
      >
        <PlusIcon />
        Add task
      </IconButton>
    </Box>
  );
}

export default ColumnContainer;