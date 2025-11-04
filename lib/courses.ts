// Central, type-safe directory for states and their courses

export type StateId = "ny";

export interface Course {
  id: string;
  name: string;
  url: string;
}

export interface State {
  id: StateId;
  name: string;
  courses: Record<string, Course>;
}

export const states: Record<StateId, State> = {
  ny: {
    id: "ny",
    name: "New York",
    courses: {
      bethpage: {
        id: "bethpage",
        name: "Bethpage",
        url: "https://foreupsoftware.com/index.php/booking/19765/2431#teetimes",
      },
    },
  },
};

export function getStateById(stateId: string | null | undefined): State | null {
  if (!stateId) return null;
  const key = stateId.toLowerCase() as StateId;
  return states[key] ?? null;
}
