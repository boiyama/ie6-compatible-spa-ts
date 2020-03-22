import { app } from "hyperapp";
import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { location } from "../lib/@hyperapp/router";
import actions, { Actions } from "./actions";
import state, { State } from "./state";
import view from "./view";

const options = {
  detection: {
    caches: ["cookie"]
  },
  debug: false,
  fallbackLng: "en",
  resources: {
    en: {
      translation: {
        site: {
          title: "IE6 SPA in TS",
          menu: ["Technology Stack", "Data Fetching"]
        },
        home: {
          heading:
            "The most modern IE6-compatible websites at the present time",
          body: [
            "IE 6 released in 2001 is the web browser which has a 0.01% market share in 2020 and supports for all Windows provided with IE 6 already ended.",
            "This website is a modern web application which is written in TypeScript, built as a SPA with Hyperapp, and bundled with Percel.",
            "But it works with IE 6.",
            "I have checked it with native IE 6 on Windows XP provided by BrowserStack."
          ]
        },
        technologyStack: {
          heading: "Technology stack of this website"
        },
        dataFetching: {
          heading: "Asynchronous data fetching example",
          fetchData: "Fetch data"
        }
      }
    },
    ja: {
      translation: {
        site: {
          title: "IE6 SPA in TS",
          menu: ["技術スタック", "非同期通信"]
        },
        home: {
          heading: "今もっともモダンな IE6 対応サイト",
          body: [
            "2001 年にリリースされた IE6 は、2020 年現在ブラウザシェア 0.01% で、IE6 が提供されている全ての Windows はすでにサポート終了しています。",
            "このサイトは TypeScript で記述され、Hyperapp で SPA として構築され、Parcel でバンドルされた今時のアプリケーションです。",
            "が、IE6で動作します。",
            "動作確認は BrowserStack の提供する Windows XP 上のネイティブな IE6 で行なっております。"
          ]
        },
        technologyStack: {
          heading: "このサイトの技術スタック"
        },
        dataFetching: {
          heading: "非同期通信サンプル",
          fetchData: "データ取得"
        }
      }
    }
  }
};

const run = () => {
  const main = app<State, Actions>(state, actions, view, document.body);
  location.subscribe(main.location);
};

i18next.use(LanguageDetector).init(options, run);
