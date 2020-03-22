const fs = require("fs");
const util = require("util");
const writeFileAsync = util.promisify(fs.writeFile);

const babel = require("@babel/core");
const Bundler = require("parcel-bundler");
const JSPackager = require("parcel-bundler/src/packagers/JSPackager");

class CustomJSPackager extends JSPackager {
  async setup() {
    const result = await super.setup();

    this.dest = {
      _buffer: "",
      path: this.dest.path,
      bytesWritten: 0,
      async write(data) {
        this._buffer += data;
      },
      async end() {
        let code = this.path.includes("document.createElement_")
          ? this._buffer
          : this._buffer
              .replace(".createElement(", ".createElement_(")
              .replace("setAttribute", "setAttribute_")
              .replace("removeAttribute", "removeAttribute_")
              .replace(
                "insertBefore(newElement, element)",
                "insertBefore(newElement, element || null)"
              );

        code = babel.transformSync(code, {
          inputSourceMap: false,
          retainLines: true,
          minified: true,
          plugins: [
            "@babel/plugin-transform-member-expression-literals",
            "@babel/plugin-transform-property-literals",
            "@babel/plugin-transform-property-mutators",
            "@babel/plugin-transform-reserved-words"
          ]
        }).code;

        this.bytesWritten = code.length;
        return writeFileAsync(this.path, code);
      }
    };

    return result;
  }
}

const bundler = new Bundler("./src/index.html", {
  outDir: "./dist",
  outFile: "index.html"
});
bundler.addPackager("js", CustomJSPackager);

module.exports = bundler;
