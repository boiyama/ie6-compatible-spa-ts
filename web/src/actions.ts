import $ from "jquery";
import { location } from "../lib/@hyperapp/router";
import { State, Repo } from "./state";

const actions = {
  location: location.actions,
  fetchData: () => (
    _: State,
    actions: {
      setState: (state: { loading: boolean } | { repos: Repo[] }) => State;
    }
  ) => {
    actions.setState({ loading: true });
    $.ajax({
      url: process.env.API_ENDPOINT,
      jsonp: "callback",
      dataType: "jsonp"
    }).done((repos: Repo[]) => {
      actions.setState({ loading: false });
      actions.setState({ repos });
    });
  },
  setState: (state: State) => state
};

export type Actions = typeof actions;

export default actions;
