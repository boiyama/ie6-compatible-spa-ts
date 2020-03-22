import { VNode } from "hyperapp";
import { parseRoute } from "./parseRoute";

interface Match {
  url: string;
  path: string;
  isExact: boolean;
  params?: { [path: string]: string };
}

export interface RenderProps {
  location?: Location;
  match?: Match;
}

interface RouteProps {
  parent?: boolean;
  path?: string;
  location?: Location;
  render: (props: RenderProps) => VNode<RenderProps>;
}

export function Route(props: RouteProps) {
  return (function (state: { location: Location }) {
    const location = state.location;
    const match =
      props.path &&
      parseRoute(props.path, location.pathname, {
        exact: !props.parent
      });

    return (
      match &&
      props.render(
        {
          match: match,
          location: location
        }
      )
    );
  } as unknown) as JSX.Element;
}
