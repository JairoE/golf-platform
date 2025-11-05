import {states} from "../../data/courses";
import StatePageClient from "./StatePageClient";

export function generateStaticParams() {
  return states.map((state) => ({
    state: state.code,
  }));
}

export default function StatePage() {
  return <StatePageClient />;
}
