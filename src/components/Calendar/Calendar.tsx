import React, { useState, ChangeEvent } from 'react';
import { Autocomplete, Box, Button, Container, TextField } from '@mui/material';
import { countries } from '../../utils/data';
import { toast } from 'react-toastify';
import { DateTimeProps } from '../../interfaces/types';



interface FormFieldProps {
  label: string;
  id: string;
  type: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const inputFieldStyle = {
  padding: '0.5rem',
  borderRadius: '5px',
  border: '1px solid #ccc',
};

const FormField: React.FC<FormFieldProps> = ({ label, id, type, value, onChange }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
    <label htmlFor={id} style={{ marginRight: '1rem' }}>{label}</label>
    <TextField
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      variant="outlined"
      size="small"
      InputProps={{ style: inputFieldStyle }}
    />
  </div>
);

interface AutocompleteFieldProps {
  id: string;
  label: string;
  options: { label: string; code: string; phone: string }[];
  onSelect: (value: string) => void;
}

const AutocompleteField: React.FC<AutocompleteFieldProps> = ({ id, label, options, onSelect }) => (
  <Autocomplete
    id={id}
    sx={{ width: 300 }}
    options={options}
    autoHighlight
    getOptionLabel={(option) => option.label}
    renderOption={(props, option) => (
      <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
        <img
          loading="lazy"
          width="20"
          srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
          src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
          alt=""
        />
        {option.label} ({option.code}) +{option.phone}
      </Box>
    )}
    renderInput={(params) => (
      <TextField
        {...params}
        label={label}
        inputProps={{
          ...params.inputProps,
          autoComplete: 'new-password', // disable autocomplete and autofill
        }}
      />
    )}
    onChange={(_event, value) => onSelect(value ? value.label : '')}
  />
);

export interface Props {
  changeDateTime: (dateTime: DateTimeProps)=> void
  nextStep: ()=> void
}

const Calendar: React.FC<Props> = ({changeDateTime, nextStep}) => {
  const [dateTime, setDateTime] = useState<DateTimeProps>({
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    startCountry: '',
    endCountry: ''
  });

  const handleSubmit = () => {
    if(validateForm()){
      changeDateTime(dateTime)
      console.log(dateTime)
      nextStep()
    }
  };

  const handleDateTimeChange = (field: keyof DateTimeProps) => (e: ChangeEvent<HTMLInputElement>) => {
    setDateTime({ ...dateTime, [field]: e.target.value });
  };

  const handleCountrySelect = (value: string, field: keyof DateTimeProps) => {
    setDateTime({ ...dateTime, [field]: value });
  };

  // Convertir countries a un array mutable
  const countriesArray = Array.from(countries);

  const validateForm = ():boolean => {
    // Verificar si los campos están completos
    if (
      !dateTime.startDate ||
      !dateTime.endDate ||
      !dateTime.startTime ||
      !dateTime.endTime ||
      !dateTime.startCountry ||
      !dateTime.endCountry
    ) {
      toast('Por favor, complete todos los campos.');
      return false;
    }

    // Convertir fechas a objetos Date para comparación
    const startDate = new Date(dateTime.startDate);
    const endDate = new Date(dateTime.endDate);

    // Verificar si la fecha de salida es menor que la fecha de entrada
    if (endDate <= startDate) {
      toast('La fecha de salida debe ser posterior a la fecha de entrada.');
      return false;
    }

    // Verificar si los países son diferentes
    if (dateTime.startCountry === dateTime.endCountry) {
      toast('El país de salida debe ser diferente al país de entrada.');
      return false;
    }
    
    return true;
  };

  return (
    <Container maxWidth={false} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center', width: '100%', height: '100vh', '@media screen and (max-width: 440px)': { height: 'auto' } }}>
      <Box sx={{ position: 'relative', padding: '1rem', display: 'flex', flexDirection: 'column', borderRadius: '10px', width: '30%', minWidth: '500px', height: '70%', backgroundColor: 'gray', '@media screen and (max-width: 440px)': { flexDirection: 'column', height: '100%', width: '100%' } }}>
        <FormField label="Fecha de entrada:" id="start-date" type="date" value={dateTime.startDate} onChange={handleDateTimeChange('startDate')} />
        <FormField label="Fecha de salida:" id="end-date" type="date" value={dateTime.endDate} onChange={handleDateTimeChange('endDate')} />
        <FormField label="Hora de entrada:" id="start-time" type="time" value={dateTime.startTime} onChange={handleDateTimeChange('startTime')} />
        <FormField label="Hora de salida:" id="end-time" type="time" value={dateTime.endTime} onChange={handleDateTimeChange('endTime')} />
        <Box sx={{ position: 'relative', padding: '1rem', display: 'flex' }}>
          <AutocompleteField id="start-country-select-demo" label="País de salida" options={countriesArray} onSelect={(value) => handleCountrySelect(value, 'startCountry')} />
          <AutocompleteField id="end-country-select-demo" label="País de entrada" options={countriesArray} onSelect={(value) => handleCountrySelect(value, 'endCountry')} />
        </Box>
        <Button variant='contained' onClick={() => handleSubmit()} sx={{ height: '60px', width: '350px', minWidth: '350px', cursor: 'pointer', borderRadius: '8px', backgroundColor: '#202020', border: '2px solid #161C22', padding: '16px', boxShadow: '0 0 0 3px #F0C419', '&:hover': { boxShadow: '0 0 0 2px #F0C419' }, display: 'flex', gap: '8px' }}>
          End
        </Button>
      </Box>
    </Container>
  );
};

export default Calendar;