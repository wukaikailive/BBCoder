import ASTParser from './src/ASTParser';
import { ASTType } from './src/ASTNode';

function defaultVistor() {
  return {
    u(node, results) {
      return `<u>${results.join('')}</u>`;
    },
    i(node, results) {
      return `<i>${results.join('')}</i>`;
    },
    url(node, results) {
      return `<a href="${results.join('')}">${results.join('')}</a>`;
    },
    img(node, results) {
      return `<img src="${results.join('')}">`;
    },
    quote(node, results) {
      return `<blockquote><p>${results.join('')}</p></blockquote>`;
    },
    code(node, results) {
      return `<pre>${results.join('')}</pre>`;
    },
    size(node, results) {
      return `<span style="font-size: ${node.value}px;">${results.join('')}</span>`;
    },
    color(node, results) {
      return `<span style="color: ${node.value};">${results.join('')}</span>`;
    },
    ':-)'() {
      return `<img src="Face-smile.gif" alt="" />`;
    },
  };
}

function defaultOptions() {
  return {
    autoCloseTag: false, // 自动关闭未关闭的标签，如[u] 会被补全为[u][/u]
    ignoreUncloseTag: false, // 是否忽略未关闭的标签，未关闭的标签不会显示，会被删掉
    outputUncloseTag: true, // 是否输出未关闭的标签，未关闭的标签会原样显示
  };
}

class ASTTraverser {
  constructor(ast, vistor, options) {
    this.ast = ast;
    this.vistor = vistor;
    this.options = Object.assign({}, defaultOptions(),options);
  }

  traverse() {
    return this.traverseNode(this.ast, null);
  }
  traverseLabel(array, parent) {
    let results = array.map((child) => {
      try {
        return this.traverseNode(child, parent);
      } catch (error) {
        console.error(error);
      }
      return '';
    });
    switch (parent.type) {
      case ASTType.root:
        return results.join('');
      case ASTType.label:
        let node = parent;
        let handler = this.vistor[node.label];
        if(this.options.autoCloseTag){
          node.setClose(true)
        }
        let isClose = node.isClose;
        if (!isClose) {
          if (this.options.ignoreUncloseTag) {
            return results.join('');
          } else if (this.options.outputUncloseTag) {
            return `[${node.fullLabel}]${results.join('')}`;
          }
        }
        if (handler) {
          return handler(node, results);
        }
        return `[${node.fullLabel}]${results.join('')}[/${node.label}]`;
      default:
        return results.join('');
    }
  }
  traverseNode(node, parent) {
    switch (node.type) {
      case ASTType.root:
        return this.traverseLabel(node.body, node);
      case ASTType.string:
        return node.value;
      case ASTType.label:
        return this.traverseLabel(node.children, node);
    }
  }
}

export default class BBCoder {
  constructor(input, options) {
    this.input = input;
    this.options = options;
    this.parser = new ASTParser(this.input,this.options);
    this.vistor = defaultVistor();
  }

  parse() {
    this.parser.tokenizer();
    this.parser.parser();
    return this.parser;
  }

  html(vistor) {
    this.vistor = Object.assign(this.vistor, vistor);
    let traverser = new ASTTraverser(this.parser.ast, this.vistor, this.options);
    return traverser.traverse();
  }
}
