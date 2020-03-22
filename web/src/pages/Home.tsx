import { h } from "hyperapp";
import i18next from "i18next";

export default () => (
  <div
    class="site-body"
    style={{
      paddingTop: "220px",
      color: "#fff"
    }}
  >
    <div class="site-center">
      <div class="col">
        <div class="cell">
          <h2>{i18next.t("home.heading")}</h2>
        </div>
      </div>
      <div class="col">
        <div class="cell">
          {(i18next.t("home.body", { returnObjects: true }) as string[]).map(
            (sentence) => (
              <p
                style={{
                  fontSize: "120%",
                  lineHeight: "200%"
                }}
              >
                {sentence}
              </p>
            )
          )}
        </div>
      </div>
    </div>
  </div>
);
