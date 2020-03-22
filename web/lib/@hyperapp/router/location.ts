interface LocationState {
  pathname: string;
  previous: string;
}

interface LocationActions {
  go: (pathname: string) => void;
  set: (data: LocationState) => LocationState;
}

!window.history.pushState && window.location.replace("#/");

function wrapHistory(keys: ("pushState" | "replaceState")[]) {
  return keys.reduce<() => void>(
    function (next, key) {
      const fn = history[key];

      history[key] = function (data, title, url) {
        fn.call(this, data, title, url);
        dispatchEvent(
          new CustomEvent<string>("pushstate", { detail: data })
        );
      };

      return function () {
        history[key] = fn;
        next && next();
      };
    },
    function () {}
  );
}

export const location = window.history.pushState
  ? {
      state: {
        pathname: window.location.pathname,
        previous: window.location.pathname
      },
      actions: {
        go: function (pathname: string) {
          history.pushState(null, "", pathname);
        },
        set: function (data: LocationState) {
          return data;
        }
      },
      subscribe: function (actions: LocationActions) {
        function handleLocationChange(e: CustomEvent<string>) {
          actions.set({
            pathname: window.location.pathname,
            previous: e.detail
              ? ((window.location as Location & { previous: string }).previous =
                  e.detail)
              : (window.location as Location & { previous: string }).previous
          });
        }

        const unwrap = wrapHistory(["pushState", "replaceState"]);

        addEventListener("pushstate", handleLocationChange as EventListener);
        addEventListener("popstate", handleLocationChange as EventListener);

        return function () {
          removeEventListener(
            "pushstate",
            handleLocationChange as EventListener
          );
          removeEventListener(
            "popstate",
            handleLocationChange as EventListener
          );
          unwrap();
        };
      }
    }
  : {
      state: {
        pathname: window.location.hash.slice(1),
        previous: window.location.hash.slice(1)
      },
      actions: {
        go: function (pathname: string) {
          window.location.hash = `#${pathname}`;
        },
        set: function (data: LocationState) {
          return data;
        }
      },
      subscribe: function (actions: LocationActions) {
        const intervalID = setInterval(() => {
          const pathname = window.location.hash.slice(1);
          if (this.state.pathname !== pathname) {
            actions.set({
              pathname: pathname,
              previous: this.state.pathname
            });
          }
        }, 100);

        return () => clearInterval(intervalID);
      }
    };
