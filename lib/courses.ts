// Central, type-safe directory for cities and their courses

export type CityId = 'nyc'

export interface Course {
  id: string
  name: string
  url: string
}

export interface City {
  id: CityId
  name: string
  courses: Record<string, Course>
}

export const cities: Record<CityId, City> = {
  nyc: {
    id: 'nyc',
    name: 'NYC',
    courses: {
      bethpage: {
        id: 'bethpage',
        name: 'Bethpage',
        url: 'https://foreupsoftware.com/index.php/booking/19765/2431#teetimes',
      },
    },
  },
}

export function getCityById(cityId: string | null | undefined): City | null {
  if (!cityId) return null
  const key = cityId.toLowerCase() as CityId
  return cities[key] ?? null
}


