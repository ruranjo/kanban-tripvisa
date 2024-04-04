import React, { useEffect, useState } from 'react'
import './App.css'
import { Box,  SxProps} from '@mui/material';
import { Calendar, Itidenary, KanbanBoard } from './components';
import { DateTimeProps, Day } from './interfaces/types';


export interface styledApp {
  containerStyle: SxProps;
  bgContainer: SxProps;
  containerStyleMenu: SxProps;
  boxStyle: SxProps;
  sidebar: SxProps;
  sidebarBoxContainer: SxProps;
  sidebarBox: SxProps;
  steps: SxProps;
  iconNumberSidebar:SxProps;
  textMenu:SxProps;
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
  containerStyleMenu:{
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    alignContent:'center',
    width:'100%',
    height:'100vh',
    '@media screen and (max-width: 440px)': {
      height:'auto',
    },
  },
  boxStyle:{
    position:'relative',
    //border:'1px solid red',
    padding:'1rem',
    display: 'flex',
    justifyContent:'space-between',
    borderRadius:'10px',
    width:'70%',
    minWidth:'500px',
    height:'70%',
    backgroundColor: "#202020",
    '@media screen and (max-width: 440px)': {
      flexDirection:'column',
      height:'100%',
      width:'100%',
    },
  },
  sidebar:{
    //border:'1px solid purple',
    
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    borderRadius:'10px',
    width:'30%',
    '@media screen and (max-width: 440px)': {
    
      width:'100%',
      height:'200px'
    },
  },
  sidebarBoxContainer:{
    //border:'1px solid yellow',
    display:'flex',
    gap:'2rem',
    flexDirection:'column',
    
    marginTop:'2rem',
    marginLeft:'2rem',
    color:'white',
    '@media screen and (max-width: 440px)': {
      marginTop:'0',
      marginLeft:'0',
      height:'100%',
      flexDirection:'row',
      justifyContent:'center',
      alignItems:'center',
      gap:'1rem',
    },
  },

  sidebarBox:{
    //border:'1px solid red',
    display:'flex',
    gap:'1rem',
    alignItems:'center',
    
    color:'white',
    '@media screen and (max-width: 440px)': {
      flexDirection:'row',
      height:'auto',
    },
  },
  iconNumberSidebar:{
    
    border:'1px solid white',
    borderRadius:'50%',
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    width:'30px',
    height:'30px',
    color:'white',
  },
  steps:{
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    //border:'1px solid tomato',
    width:'70%',
    '@media screen and (max-width: 440px)': {
      height:'100%',  
      width:'90%',
    },
  },
  textMenu:{
    '@media screen and (max-width: 440px)': {
      display:'none',
    },
  }
}

const progressSteps = [
  {
    stepNumber:1,
    title:'KANBAN',
  },
  {
    stepNumber:2,
    title:'CALENDAR',
  },
  {
    stepNumber:3,
    title:'ITINEDARY',
  },
]

const App:React.FC<{}> = () => {
  const [currentStep, setCurrentStep]  = useState(progressSteps[0].stepNumber);
  const [daysState, setDaysState] = useState<Day[]>([] as Day[]);
  const [dateTime, setDateTime] = useState<DateTimeProps>({
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    startCountry: '',
    endCountry: ''
  });

  const changeState = (days: Day[]) =>{
    setDaysState(days)
  }

  const changeStateTime = (dateTime:DateTimeProps) =>{
    setDateTime(dateTime)
  }

  useEffect(()=>{
    console.log(daysState)
  },[daysState])

  const nextStep = () =>{
    setCurrentStep(prev => prev+1);
  }
//
  return (
    <>
      <Box sx={appStyle.containerStyle}>
        {
          currentStep === progressSteps[0].stepNumber && <KanbanBoard changeState={changeState} nextStep={nextStep} />
        }
        {
          currentStep === progressSteps[1].stepNumber && <Calendar  changeDateTime={changeStateTime}  nextStep={nextStep}/>
        }
        {
          currentStep === progressSteps[2].stepNumber && <Itidenary daysState={daysState} dateTime={dateTime} />
        }
      </Box>
    </>
  )
}

export default App


