import TokenStream, { TokenNodeType } from './TokenStream';
import InputStream from './InputStream';
import ASTNode, { ASTType, AST, ASTString, ASTLabel } from './ASTNode';
export default class ASTParser {
  constructor(input,options) {
    this.input = input;
    this.tokens = [];
    this.ast = null;
    this.options = options || {}
  }

  tokenizer() {
    let tokenStream = new TokenStream(new InputStream(this.input));
    let tokens = [];
    let node = tokenStream.next();
    while (node != null) {
      tokens.push(node);
      node = tokenStream.next();
    }
    this.tokens = tokens;
  }

  parser() {
    let ast = new AST();
    this.current = 0;
    while (this.current < this.tokens.length) {
      ast.body.push(this.walk(ast.body));
    }
    this.ast = ast;
    return ast;
  }

  walk(parent) {
    let token = this.tokens[this.current];
    switch (token.type) {
      case TokenNodeType.string:
        this.current ++
        return this.createASTString(token.value);
      case TokenNodeType.startPracket:
        return this.label(token,parent)
      case TokenNodeType.endBracket:
        this.current ++
        if(this.options.ignoreUncloseTag){
          return this.createASTString('')
        } else if(this.options.outputUncloseTag) {
          return this.createASTString(`[${token.value}]`)
        }
        throw new Error('未匹配的结束标签:'+ token.value)
    }
  }

  label(token,parent) {
    let value = token.value
    let split = value.split('='); // [font=黑体]
    let labelNode =  new ASTLabel(ASTType.label, split[0], split[1]);
    if(!token){
      return labelNode
    }
    token = this.tokens[++this.current]
    if(!token){
      labelNode.setClose(false)
      return labelNode
    }
    while(token.type !== TokenNodeType.endBracket || token.value !== '/'+labelNode.label){
      if(token.type === TokenNodeType.endBracket && token.value !== '/'+labelNode.label){
        let length = labelNode.children.length
        labelNode.children = []
        this.current -= (length - 1)
        this.current --
        labelNode.setClose(false)
        return labelNode
      }
      labelNode.push(this.walk(labelNode))
      token = this.tokens[this.current];
      if(!token){
        labelNode.setClose(false)
        let length = labelNode.children.length
        labelNode.children = []
        this.current -= (length -1)
        return labelNode
      }
    }
    labelNode.setClose(true)
    this.current++
    return labelNode
  }

  getPosition(index) {
    return tokens[index].position;
  }

  createASTString(value) {
    return new ASTString(TokenNodeType.string, value);
  }
}
