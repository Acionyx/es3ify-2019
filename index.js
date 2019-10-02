var simple = require("jstransform/simple");
var through = require("through");

var reserved = [
  "break",
  "case",
  "catch",
  "continue",
  "default",
  "delete",
  "do",
  "else",
  "finally",
  "for",
  "function",
  "if",
  "in",
  "instanceof",
  "new",
  "return",
  "switch",
  "this",
  "throw",
  "try",
  "typeof",
  "var",
  "void",
  "while",
  "with",
  "abstract",
  "boolean",
  "byte",
  "char",
  "class",
  "const",
  "debugger",
  "double",
  "enum",
  "export",
  "extends",
  "final",
  "float",
  "goto",
  "implements",
  "import",
  "int",
  "interface",
  "long",
  "native",
  "package",
  "private",
  "protected",
  "public",
  "short",
  "static",
  "super",
  "synchronized",
  "throws",
  "transient",
  "volatile",
  "null"
];
var reservedDict = {};
reserved.forEach(function(k) {
  reservedDict[k] = true;
});

var reCommaOrComment = /,|\/\*.+?\*\/|\/\/[^\n]+/g;
function stripComma(value) {
  return value.replace(reCommaOrComment, function(text) {
    if (text === ",") {
      return "";
    } else {
      // Preserve comments
      return text;
    }
  });
}

function transform(code) {
  return simple.transform(code, {
    harmony: true,
    react: true,
    utility: true,
    target: "es3",
    stripTypes: true
  }).code;
}

function process(file) {
  if (/\.json$/.test(file)) return through();
  var data = "";
  function write(chunk) {
    data += chunk;
  }

  function compile() {
    var source;

    try {
      source = transform(data);
    } catch (e) {
      return this.emit("error", e);
    }

    this.queue(source);
    this.queue(null);
  }

  return through(write, compile);
}

module.exports = process;
module.exports.isReserved = function(word) {
  return reservedDict.hasOwnProperty(word) ? !!reservedDict[word] : false;
};
module.exports.transform = transform;
