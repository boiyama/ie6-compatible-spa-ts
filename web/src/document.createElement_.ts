const isIE7AndBelow = /MSIE (6|7)/.test(window.navigator.appVersion);

(document as Document & {
  createElement_: typeof document.createElement;
}).createElement_ = window.addEventListener
  ? function (nodeName: keyof HTMLElementTagNameMap) {
      const element = document.createElement(
        nodeName
      ) as HTMLElementTagNameMap[keyof HTMLElementTagNameMap] & {
        setAttribute_: (qualifiedName: string, value: string) => void;
        removeAttribute_: (qualifiedName: string) => void;
      };
      element.setAttribute_ = element.setAttribute;
      element.removeAttribute_ = element.removeAttribute;
      return element;
    }
  : function (nodeName: keyof HTMLElementTagNameMap) {
      const element = document.createElement(
        nodeName
      ) as HTMLElementTagNameMap[keyof HTMLElementTagNameMap] & {
        setAttribute_: (qualifiedName: string, value: string) => void;
        removeAttribute_: (qualifiedName: string) => void;
        attachEvent: (type: string, listener: unknown) => void;
        detachEvent: (type: string, listener: unknown) => void;
      };

      const registry: unknown[][] = [];

      element.addEventListener = function (
        type: string,
        listener: (
          this: typeof element,
          ev: HTMLElementEventMap[keyof HTMLElementEventMap]
        ) => any
      ) {
        const target = this;

        registry.unshift([
          target,
          type,
          listener,
          function (event: HTMLElementEventMap[keyof HTMLElementEventMap]) {
            (event as {
              currentTarget: EventTarget | null;
            }).currentTarget = target;
            event.preventDefault = function () {
              event.returnValue = false;
            };
            event.stopPropagation = function () {
              event.cancelBubble = true;
            };
            (event as { target: EventTarget | null }).target =
              event.srcElement || target;

            listener.call(target, event);
          }
        ]);

        this.attachEvent("on" + type, registry[0][3]);
      };

      element.removeEventListener = function (
        type: string,
        listener: (
          this: typeof element,
          ev: HTMLElementEventMap[keyof HTMLElementEventMap]
        ) => any
      ) {
        for (let index = 0, register; (register = registry[index]); ++index) {
          if (
            register[0] == this &&
            register[1] == type &&
            register[2] == listener
          ) {
            return this.detachEvent(
              "on" + type,
              registry.splice(index, 1)[0][3]
            );
          }
        }
      };

      element.setAttribute_ = isIE7AndBelow
        ? function (name, value) {
            if (name === "class") {
              return element.setAttribute("className", value);
            } else {
              return element.setAttribute(name, value);
            }
          }
        : element.setAttribute;

      element.removeAttribute_ = isIE7AndBelow
        ? function (name) {
            if (name === "class") {
              return element.removeAttribute("className");
            } else {
              return element.removeAttribute(name);
            }
          }
        : element.removeAttribute;

      return element;
    };
