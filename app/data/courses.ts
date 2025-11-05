import {Course, CoursesByState} from "../types/course";

export const courses: Course[] = [
  {
    id: "bethpage",
    name: "Bethpage",
    url: "https://foreupsoftware.com/index.php/booking/19765/2431#teetimes",
    state: "NY",
  },
  {
    id: "nyc",
    name: "NYC",
    url: "https://golf-nyc.book.teeitup.com/search",
    state: "NY",
  },
  // Add more courses here as needed
];

export const coursesByState: CoursesByState = courses.reduce((acc, course) => {
  if (!acc[course.state]) {
    acc[course.state] = [];
  }
  acc[course.state].push(course);
  return acc;
}, {} as CoursesByState);

export const states = [
  {code: "NY", name: "New York"},
  // Add more states here as needed
] as const;
