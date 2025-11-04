export interface Course {
  id: string;
  name: string;
  url: string;
  state: string;
}

export interface State {
  code: string;
  name: string;
}

export type CoursesByState = Record<string, Course[]>;
