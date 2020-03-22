import { h, VNode } from "hyperapp";

interface LocationState {
  pathname: string;
  previous: string;
}

function getOrigin(loc: Location | HTMLAnchorElement) {
  return loc.protocol + "//" + loc.hostname + (loc.port ? ":" + loc.port : "");
}

function isExternal(anchorElement: HTMLAnchorElement) {
  // Location.origin and HTMLAnchorElement.origin are not
  // supported by IE and Safari.
  return getOrigin(location) !== getOrigin(anchorElement);
}

export const Link = window.history.pushState
  ? function (
      props: {
        to: string;
        location?: Location;
        onclick?: (e: MouseEvent) => void;
        target?: string;
        href?: string;
      },
      children: Array<VNode | string>
    ) {
      return (function (state: { location: LocationState }) {
        const to = props.to;
        const location = state.location;
        const onclick = props.onclick;
        delete props.to;
        delete props.location;

        props.href = to;
        props.onclick = function (e) {
          if (onclick) {
            onclick(e);
          }
          if (
            !(e.defaultPrevented ||
            e.button !== 0 ||
            e.altKey ||
            e.metaKey ||
            e.ctrlKey ||
            e.shiftKey ||
            props.target === "_blank" ||
            e.currentTarget instanceof HTMLAnchorElement
              ? isExternal(e.currentTarget as HTMLAnchorElement)
              : false)
          ) {
            e.preventDefault();

            if (to !== location.pathname) {
              history.pushState(location.pathname, "", to);
            }
          }
        };

        return h("a", props, children);
      } as unknown) as JSX.Element;
    }
  : function (
      props: {
        to: string;
        href?: string;
      },
      children: Array<VNode | string>
    ) {
      return (function () {
        props.href = `#${props.to}`;
        return h("a", props, children);
      } as unknown) as JSX.Element;
    };
