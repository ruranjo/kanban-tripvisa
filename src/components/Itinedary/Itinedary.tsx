import React from 'react'
import { DateTimeProps, Day } from '../../interfaces/types'
import { Box, SxProps, Typography } from '@mui/material'
import { Header } from '../../utils/assets';

export interface styledItinedary {
    containerMain: SxProps;
    containerHeader: SxProps;
    title: SxProps;
    containerDateTime: SxProps;
    dateTimeContainer: SxProps;
    dateTimeBox: SxProps;
    dateTimeText: SxProps;
    containerDaysState: SxProps;
    itemDayBox: SxProps;
    itemDay: SxProps;
    timeofdayStyle: SxProps;
    footerText: SxProps;
}

const itinedaryStyle: styledItinedary = {
    containerMain:{
      
      position:'relative',
      //border:'1px solid red', 
      
      backgroundColor:'#596c70',
      display:'flex',
      flexDirection:'column',
      alignItems:'center',
      width:'100%',
      
      margin:'0px',
      padding:'0px',
      '@media screen and (max-width: 440px)': {
        
      },
    },
    containerHeader:{
      display:'flex',
      flexDirection:'column',
      justifyContent:'center',
      
      borderRadius:'5px',
      width:'80%',
      height:'220px',
      'img':{
        
        
        border:'5px solid #121923', 
      }
    },
    containerDateTime:{
      marginTop:'1rem',
      //border:'1px solid tomato',
      display:'flex',
      flexDirection:'column',
      justifyContent:'center'
    },
    title:{
      display:'flex',
      justifyContent:'center',
      fontSize:'4rem',
      color:'white',
      fontWeight:700
    },
    dateTimeContainer:{
      //border:'1px solid black', 
      display:'flex',
      justifyContent:'center',
      gap:2,
    },
    dateTimeBox:{
      border:'5px solid #df920e',
      borderRadius:'40px',
      paddingLeft:'3rem',
      paddingRight:'3rem',
    },
    dateTimeText:{
      color:'white',
      display:'flex',
      justifyContent:'center',
      
    },
    ////////////////////////////////////
    containerDaysState:{
      marginTop:'4rem',
      marginBottom:'4rem',
      display:'flex',
      flexDirection:'column',
      gap:5
    },
    itemDayBox:{
      width:'80%',
      borderBottom:'5px solid #df920e',
      color:'white',
      display:'flex',
      gap:4,
      
      
      flexDirection:'column',
      
    },
    itemDay:{
      
      display:'flex',
      flexDirection:'column',
      gap:4,
    },
    timeofdayStyle:{
      display:'flex',
      alignItems:'center',
      
      gap:5
    },
    footerText:{
      width:'80%',
      borderBottom:'5px solid #df920e',
      color:'white',
    }
    
  }

export interface Props {
    daysState: Day[]
    dateTime: DateTimeProps
}
  
const Itinedary: React.FC<Props> = ({dateTime, daysState}) => {
  const formatDate = (date: string): string => {
    const months: string[] = [
      "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
      "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
  ];

    const [year, monthIndex, day] = date.split('-');
    const month: string = months[parseInt(monthIndex) - 1];

    return `${day} DE ${month} DE ${year}`;
  };
  
  return (
    <Box sx={itinedaryStyle.containerMain}>
        <Box sx={itinedaryStyle.containerHeader}>
          <img src={Header} alt="" />
        </Box>
        <Box sx={itinedaryStyle.containerDateTime}>
            <Typography sx={itinedaryStyle.title}>ITINERARIO</Typography>
            <Box sx={itinedaryStyle.dateTimeContainer}>
              <Box sx={itinedaryStyle.dateTimeBox}>
                <Typography sx={itinedaryStyle.dateTimeText}>SALIDA: {formatDate(dateTime.startDate)} </Typography>
                <Typography sx={itinedaryStyle.dateTimeText}>HORA: {dateTime.startTime}</Typography>
                <Typography sx={itinedaryStyle.dateTimeText}>{dateTime.startCountry.toUpperCase()}  - {dateTime.endCountry.toUpperCase()}</Typography>
              </Box>
              <Box sx={itinedaryStyle.dateTimeBox}>
                <Typography sx={itinedaryStyle.dateTimeText} >LLEGADA: {formatDate(dateTime.endDate)} </Typography>
                <Typography sx={itinedaryStyle.dateTimeText} >HORA: {dateTime.endTime}</Typography>
                <Typography sx={itinedaryStyle.dateTimeText} >{dateTime.endCountry.toUpperCase()} - {dateTime.startCountry.toUpperCase()}</Typography>
              </Box>
            </Box>
        </Box>
        {/*/////////////////////////////////////////////////////////////////////////////////////*/}
        <Box sx={itinedaryStyle.containerDaysState}>
          {daysState.map((day ,index)=>{
            return (
            <Box sx={itinedaryStyle.itemDayBox} key={index}>
                <Typography variant='h3'>{day.titleday.toUpperCase()}</Typography>
                
                <Box sx={itinedaryStyle.itemDay} key={index}>
                  
                  {
                    day.timeofday.morning.length > 0 && 
                    <Box sx={itinedaryStyle.timeofdayStyle} >
                      <Typography minWidth={100} variant='h6'>MAÑANA</Typography>
                      <Box>
                      {day.timeofday.morning.map((activity, index) => (
                          <li key={index}>{activity}</li>
                      ))}
                      </Box>
                    </Box>
                  }
                  {
                    day.timeofday.afternoon.length > 0 && 
                    <Box sx={itinedaryStyle.timeofdayStyle}>
                      <Typography minWidth={100} variant='h6'>TARDE</Typography>
                    <Box>
                    {day.timeofday.afternoon.map((activity, index) => (
                        <li key={index}>{activity}</li>
                    ))}
                    </Box>
                  </Box>
                  }
                  {
                    day.timeofday.night.length > 0 && 
                    <Box sx={itinedaryStyle.timeofdayStyle}>
                    <Typography minWidth={100} variant='h6'>NOCHE</Typography>
                    <Box>
                    {day.timeofday.night.map((activity, index) => (
                        <li key={index}>{activity}</li>
                    ))}
                    </Box>
                  </Box>
                  }
                </Box>
          </Box>
            )
          })}
        </Box>
        <Box  sx={itinedaryStyle.footerText}>
          <Typography>
          Este itinerario te permite explorar lo mejor de San Salvador en tus
          días disponibles, incluyendo actividades culturales, naturales y de
          relajación en la playa. Asegúrate de verificar los horarios de
          apertura y cierre de los lugares que desees visitar, así como de
          tomar en cuenta el tiempo de traslado entre cada destino.
          ¡Espero que disfrutes tu viaje!
          </Typography>
        </Box>
    </Box>
  )
}

export default Itinedary