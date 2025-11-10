import {Course, CoursesByState} from "../types/course";

export const courses: Course[] = [
  {
    id: "bethpage",
    name: "Bethpage State Park Golf Courses",
    url: "https://foreupsoftware.com/index.php/booking/19765/2431#teetimes",
    state: "NY",
    hasMultipleFacilities: false,
  },
  {
    id: "nyc",
    name: "Golf NYC Courses",
    url: "https://golf-nyc.book.teeitup.com/search",
    state: "NY",
    hasMultipleFacilities: true,
    selector: "[data-testid^='facility-card-']",
    dataSelectors: [
      {
        attributes: {
          "data-testid": "-name",
        },
      },
      {
        attributes: {
          "data-testid": "-address",
        },
      },
    ],
  },
  {
    id: "marine_park",
    name: "Marine Park Golf Course",
    url: "https://marineparkridepp.ezlinksgolf.com/index.html#/search",
    state: "NY",
    hasMultipleFacilities: true,
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
