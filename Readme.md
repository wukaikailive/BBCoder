# BBCoder
解析BBCode格式文本，并生成HTML文本。

支持自定义标签。

## 安装

`npm install bbcoder`

`yarn add bbcoder`

## 使用

```
let bbCoder = new BBCoder('[u]abc[u]')
bbCoder.parse()
let html = bbCoder.html()
// <u>abc</u>
```

更多例子请查看测试用例。

## 配置
支持在创建BBCoder时传入一个选项,支持以下配置：
```
{
    autoCloseTag: false, // 自动关闭未关闭的标签，如[u] 会被补全为[u][/u]
    ignoreUncloseTag: false, // 是否忽略未关闭的标签，未关闭的标签不会显示，会被删掉
    outputUncloseTag: true, // 是否输出未关闭的标签，未关闭的标签会原样显示
}
```

```
let bbCoder = new BBCoder('[u]这[/u][i]',{
    ignoreUncloseTag: true
})
bbCoder.parse()
let html = bbCoder.html()
// <u>这</u>
```

## 新增标签
BBCoder默认支持以下标签的解析：u、i、url、img、quote、code、size、color、:-)。

你可以随意覆写或新增你想要的标签，通过向html函数传递你想要覆写的标签，标签名作为函数的名称，返回值为html标签。

通过这种方式，你可以极大地扩展BBCoder的解析能力。

```
let bbCoder = new BBCoder('[q]1[/q]')
bbCoder.parse()
let html = bbCoder.html({
    q(node,results){
        // node: 当前标签对应的AST节点
        // results: 数组，其子节点计算得到的结果，一般情况下，只需要results.join('')
        // 即可得到子标签的解析结果。
        return `<div>自定义标签解析${results.join('')}</div>`
    }
})
//<div>自定义标签解析1</div>
```
