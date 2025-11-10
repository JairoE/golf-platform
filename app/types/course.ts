import {HtmlSelector} from "../utils/htmlToJson";
export interface Course {
  id: string;
  name: string;
  url: string;
  state: string;
  hasMultipleFacilities: boolean;
  selector?: string;
  dataSelectors?: HtmlSelector[];
}

export interface State {
  code: string;
  name: string;
}

export type CoursesByState = Record<string, Course[]>;
