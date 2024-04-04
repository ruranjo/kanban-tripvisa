import React from 'react'
import { DateTimeProps, Day } from '../../interfaces/types'
import { Box, SxProps, Typography } from '@mui/material'

export interface styledItinedary {
    containerMain: SxProps;
    containerHeader: SxProps;
    containerDateTime: SxProps;
    dateTimeContainer: SxProps;
    dateTimeBox: SxProps;
    containerDaysState: SxProps;
    itemDay: SxProps;
}

const itinedaryStyle: styledItinedary = {
    containerMain:{
      position:'relative',
      border:'1px solid red', 

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
      border:'1px solid yellow', 
    },
    containerDateTime:{
      border:'1px solid tomato', 
    },
    dateTimeContainer:{
      border:'1px solid blue', 
    },
    dateTimeBox:{
      border:'1px solid blue', 
    },
    ////////////////////////////////////
    containerDaysState:{

    },
    itemDay:{

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
            
        </Box>
        <Box sx={itinedaryStyle.containerDateTime}>
            <Typography>ITINERARIO</Typography>
            <Box sx={itinedaryStyle.dateTimeContainer}>
              <Box sx={itinedaryStyle.dateTimeBox}>
                <Typography>SALIDA: {formatDate(dateTime.startDate)} </Typography>
                <Typography>HORA: {dateTime.startTime}</Typography>
                <Typography>{dateTime.startCountry.toUpperCase()}  - {dateTime.endCountry.toUpperCase()}</Typography>
              </Box>
              <Box sx={itinedaryStyle.dateTimeBox}>
                <Typography>LLEGADA: {formatDate(dateTime.endDate)} </Typography>
                <Typography>HORA: {dateTime.endTime}</Typography>
                <Typography>{dateTime.endCountry.toUpperCase()} - {dateTime.startCountry.toUpperCase()}</Typography>
              </Box>
            </Box>
        </Box>
        {/*/////////////////////////////////////////////////////////////////////////////////////*/}
        <Box sx={itinedaryStyle.containerDaysState}>
          {daysState.map((day ,index)=>{
            return (
              <Box sx={itinedaryStyle.itemDay} key={index}>
                  <Typography variant='h2'>{day.titleday.toUpperCase()}</Typography>
                  <Box sx={itinedaryStyle.itemDay} key={index}>
                    {
                      day.timeofday.morning.length > 0 && 
                      <Box>
                        <Typography variant='h2'>MAÑANA</Typography>
                        <Box>
                        {day.timeofday.morning.map((activity, index) => (
                            <li key={index}>{activity}</li>
                        ))}
                        </Box>
                    </Box>
                    }
                    {
                      day.timeofday.afternoon.length > 0 && 
                      <Box>
                      <Typography variant='h2'>TARDE</Typography>
                      <Box>
                      {day.timeofday.afternoon.map((activity, index) => (
                          <li key={index}>{activity}</li>
                      ))}
                      </Box>
                    </Box>
                    }
                    {
                      day.timeofday.night.length > 0 && 
                      <Box>
                      <Typography variant='h2'>NOCHE</Typography>
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
        <Box>
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