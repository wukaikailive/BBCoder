export const TokenNodeType = {
  startPracket: "startBracket",
  endBracket:'endBracket',
  string: "string",
};

export class TokenNode {
  constructor(type, value) {
    this.type = type;
    this.value = value;
    this.current = null;
  }
}

export default class TokenStream {
  constructor(inputStream) {
    this.input = inputStream;
  }

  readNext() {
    if (this.input.eof()) return null;
    let ch = this.input.peek();
    if (ch == "[") {
      return this.readBracket();
    } else {
      return this.readString();
    }
  }

  readWhile(f) {
    let str = "";
    while (!this.input.eof() && f(this.input.peek())) {
      let ch = this.input.peek();
      str += ch;
      ch = this.input.next();
      if (ch == "\0") {
        break;
      }
    }
    return str;
  }
  readBracket() {
    this.input.next();
    let value = this.readWhile(ch => ch != "]");
    this.input.next();
    if(value.startsWith('/')){
      return this.createToken(TokenNodeType.endBracket,value)
    }
    return this.createToken(TokenNodeType.startPracket, value);
  }
  readString() {
    let value = this.readWhile(this.isNotBracket);
    return this.createToken(TokenNodeType.string, value);
  }

  isNotBracket(ch){
    return ch != '['
  }

  createToken(type, value) {
    return new TokenNode(type, value);
  }

  peek() {
    if (this.current == null) {
      this.current = this.readNext();
    }
    return this.current;
  }

  next() {
    let tok = this.current;
    this.current = null;
    if (tok == null) {
      return this.readNext();
    }
    return tok;
  }
}
