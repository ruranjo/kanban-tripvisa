export type Id = string | number;

export type Column = {
  id: Id;
  title: string;
};

export type Task = {
  id: Id;
  time: string;
  columnId: Id;
  content: string;
};

export interface Day {
  id: Id;
  titleday: string;
  timeofday: {
      morning: string[];
      afternoon: string[];
      night: string[];
  };
}


export interface CountryType {
  code: string;
  label: string;
  phone: string;
  suggested?: boolean;
}

export interface DateTimeProps {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  startCountry: string;
  endCountry: string;
}