import { location } from "../lib/@hyperapp/router";

export type Repo = {
  description: string;
  full_name: string;
  html_url: string;
};

const state = {
  location: location.state,
  loading: false,
  repos: [] as Repo[]
};

export type State = typeof state;

export default state;
