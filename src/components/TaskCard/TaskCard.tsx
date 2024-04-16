import { CSSProperties, useState } from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Id, Task } from "../../interfaces/types";
import { Box, SxProps, Typography } from "@mui/material";

interface Props {
  task: Task;
  deleteTask?: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
  doubleTask?: (id: Id) => void;
  changePeriodOfDay?: (id: Id) => void;
}

export interface styledTaskCard {
  dragging: SxProps;
  editMode: SxProps;
  textArea: CSSProperties;
  onMouseEnter: SxProps;
  textContent: SxProps;
  mouseIsOverTrashIcon: SxProps;
  mouseIsOverDifferenceIcon: SxProps;
  mouseIsOverWhetherIcon: SxProps;
}

const taskCardStyle: styledTaskCard = {
  dragging:{
    opacity: 0.3, // Equivalent to opacity-30
    backgroundColor: '#0D1117', // Assuming mainBackgroundColor is '#0D1117'
    padding: '10px', // Equivalent to p-2.5
    height: '100px',
    minHeight: '100px', // Equivalent to h-[100px] min-h-[100px]
    alignItems: 'center', // Equivalent to items-center
    display: 'flex', // Equivalent to flex
    textAlign: 'left', // Equivalent to text-left
    borderRadius: '16px', // Equivalent to rounded-xl
    border: '2px solid #F0C419', // Assuming rose-500 is '#F0C419'
    cursor: 'grab',
    position: 'relative', // Equivalent to relative
  },
  editMode:{
    backgroundColor: '#0D1117', // Assuming mainBackgroundColor is '#0D1117'
    padding: '10px', // Equivalent to p-2.5
    height: '100px',
    minHeight: '100px', // Equivalent to h-[100px] min-h-[100px]
    alignItems: 'center', // Equivalent to items-center
    display: 'flex', // Equivalent to flex
    textAlign: 'left', // Equivalent to text-left
    borderRadius:'0px 20px 20px 20px',
    '&:hover': {
      ringWidth: '2px', // Equivalent to hover:ring-2
      ringColor: 'rgba(240, 196, 25, 0.5)', // Assuming rose-500 is '#F0C419'
      ringStyle: 'inset', // Equivalent to hover:ring-inset
    },
    cursor: 'grab',
    position: 'relative', // Equivalent to relative
  
  },
  textArea:{
    height: '90%',
    width: '80%',
    resize: 'none',
    border: 'none',
    borderRadius: '8px', // Equivalent to rounded
    backgroundColor: 'transparent',
    color: 'white',
    outline: 'none', // Equivalent to focus:outline-none
  },
  onMouseEnter:{
    backgroundColor: '#0D1117', // Assuming mainBackgroundColor is '#0D1117'
    padding: '10px', // Equivalent to p-2.5
    height: '100px',
    borderRadius:'0px 20px 20px 20px',
    minHeight: '100px', // Equivalent to h-[100px] min-h-[100px]
    alignItems: 'center', // Equivalent to items-center
    display: 'flex', // Equivalent to flex
    textAlign: 'left', // Equivalent to text-left
    
    '&:hover': {
      ringWidth: '2px', // Equivalent to hover:ring-2
      ringColor: 'rgba(240, 196, 25, 0.5)', // Assuming rose-500 is '#F0C419'
      ringStyle: 'inset', // Equivalent to hover:ring-inset
    },
    cursor: 'grab',
    position: 'relative', // Equivalent to relative
  },
  textContent:{
    margin: 'auto', // Equivalent to my-auto
    height: '90%',
    width: '90%',
    overflowY: 'auto', // Equivalent to overflow-y-auto
    overflowX: 'hidden', // Equivalent to overflow-x-hidden
    whiteSpace: 'pre-wrap', // Equivalent to whitespace-pre-wrap
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
  ,
  mouseIsOverTrashIcon:{
    stroke: '#FFF', // Equivalent to stroke-white
    position: 'absolute',
    right: '0px',
    top: '20%',
    transform: 'translateY(-50%)',
    backgroundColor: '#161C22', // Assuming columnBackgroundColor is '#161C22'
    borderRadius: '8px', // Equivalent to rounded
    opacity: 0.6, // Equivalent to opacity-60
    '&:hover': {
      opacity: 1, // Equivalent to hover:opacity-100
    },
  },
  mouseIsOverDifferenceIcon:{
    stroke: '#FFF', // Equivalent to stroke-white
    position: 'absolute',
    right: '0',
    bottom: '0%',
    transform: 'translateY(-50%)',
    backgroundColor: '#161C22', // Assuming columnBackgroundColor is '#161C22'
    
    borderRadius: '8px', // Equivalent to rounded
    opacity: 0.6, // Equivalent to opacity-60
    '&:hover': {
      opacity: 1, // Equivalent to hover:opacity-100
    },
  },
  mouseIsOverWhetherIcon: {
    stroke: '#FFF', // Equivalent to stroke-white
    position: 'absolute',
    right: '0',
    bottom: '-40%',
    transform: 'translateY(-50%)',
    backgroundColor: '#161C22', // Assuming columnBackgroundColor is '#161C22'
    
    borderRadius: '8px', // Equivalent to rounded
    opacity: 0.6, // Equivalent to opacity-60
    '&:hover': {
      opacity: 1, // Equivalent to hover:opacity-100
    },
  },
  

}


const TaskCard:React.FC<Props> = ({ task, updateTask  }) => {
  const [_mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(true);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };

  if (isDragging) {
    return (
      <Box
        sx={taskCardStyle.dragging}
        ref={setNodeRef}
        style={style}
      ></Box>
    );
  }

  if (editMode) {
    return (
      <Box
        sx={taskCardStyle.editMode}
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      >
        
        <textarea
          style={taskCardStyle.textArea} 
          value={task.content}
          autoFocus
          placeholder="Task content here"
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) {
              toggleEditMode();
            }
          }}
          onChange={(e) => updateTask(task.id, e.target.value)}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={taskCardStyle.onMouseEnter}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={toggleEditMode}
      onMouseEnter={() => {
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}
    >
      
      <Typography>
            {task.time === 'mañana' && '🌤️'}
            {task.time === 'tarde' && '☀️'}
            {task.time === 'noche' && '🌙'}
        </Typography>
        <Typography sx={taskCardStyle.textContent}>
          {task.content}
        </Typography>
      

     
    </Box>
  );
}

export default TaskCard;