import React from 'react'
import './App.css'
import { Box, SxProps } from '@mui/material';
import { KanbanBoard } from './components';


export interface styledApp {
  containerStyle: SxProps;
  bgContainer: SxProps;
}

const appStyle: styledApp = {
  containerStyle:{
    position:'relative',
    //border:'1px solid red', 
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
    width:'100%',
    height:'100vh',
    margin:'0px',
    padding:'0px',
    '@media screen and (max-width: 440px)': {
      
    },
  },
  bgContainer:{
    position:'absolute',
    zIndex:-10,
    //border:'1px solid red',
    width:'100%',
    height:'30%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    // backgroundImage: `url(${bgPatternDesktop})`,
    '@media screen and (max-width: 440px)': {
      
    },
  },
}

const App:React.FC<{}> = () => {
//
  return (
    <>
    <Box sx={appStyle.bgContainer}>
    </Box>
    <Box sx={appStyle.containerStyle}>
        <KanbanBoard />
    </Box>
    </>
  )
}

export default App