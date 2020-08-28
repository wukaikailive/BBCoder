import BBCoder from '../index'

test('[u]abc[/u]', () => {
  let bbCoder = new BBCoder('[u]abc[/u]')
  bbCoder.parse()
  let html = bbCoder.html()
  expect(html).toBe('<u>abc</u>');
});


test('[i]abc[/i]', () => {
  let bbCoder = new BBCoder('[i]abc[/i]')
  bbCoder.parse()
  let html = bbCoder.html()
  expect(html).toBe('<i>abc</i>');
});

test('[url]http://wikipedia.org[/url]', () => {
  let bbCoder = new BBCoder('[url]http://wikipedia.org[/url]')
  bbCoder.parse()
  let html = bbCoder.html()
  expect(html).toBe('<a href="http://wikipedia.org">http://wikipedia.org</a>');
});

test('[img]http://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Wikipedia-logo.png/72px-Wikipedia-logo.png[/img]', () => {
  let bbCoder = new BBCoder('[img]http://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Wikipedia-logo.png/72px-Wikipedia-logo.png[/img]')
  bbCoder.parse()
  let html = bbCoder.html()
  expect(html).toBe('<img src="http://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Wikipedia-logo.png/72px-Wikipedia-logo.png">');
});

test('[quote]引言[/quote]', () => {
  let bbCoder = new BBCoder('[quote]引言[/quote]')
  bbCoder.parse()
  let html = bbCoder.html()
  expect(html).toBe('<blockquote><p>引言</p></blockquote>');
});
test('[code]Monospace固定字元宽度[/code]', () => {
  let bbCoder = new BBCoder('[code]Monospace固定字元宽度[/code]')
  bbCoder.parse()
  let html = bbCoder.html()
  expect(html).toBe('<pre>Monospace固定字元宽度</pre>');
});
test('[size=24]文字[/size]', () => {
  let bbCoder = new BBCoder('[size=24]文字[/size]')
  bbCoder.parse()
  let html = bbCoder.html()
  expect(html).toBe('<span style="font-size: 24px;">文字</span>');
});

test('[color=red]红字[/color]', () => {
  let bbCoder = new BBCoder('[color=red]红字[/color]')
  bbCoder.parse()
  let html = bbCoder.html()
  expect(html).toBe('<span style="color: red;">红字</span>');
});

test('[:-)]', () => {
  let bbCoder = new BBCoder('[:-)]',{
    autoCloseTag:true
  })
  bbCoder.parse()
  let html = bbCoder.html()
  expect(html).toBe('<img src="Face-smile.gif" alt="" />');
});


test('[u]这[/u]是[i]什[/i][color=#fff]么[/color][size=24]啊[/size]', () => {
  let bbCoder = new BBCoder('[u]这[/u]是[i]什[/i][color=#fff]么[/color][size=24]啊[/size]')
  bbCoder.parse()
  let html = bbCoder.html()
  expect(html).toBe('<u>这</u>是<i>什</i><span style=\"color: #fff;\">么</span><span style=\"font-size: 24px;\">啊</span>');
});


test('[u]这[i]是什[color=#fff]么[size=24]啊[/size][/color][/i][/u]', () => {
  let bbCoder = new BBCoder('[u]这[i]是什[color=#fff]么[size=24]啊[/size][/color][/i][/u]')
  bbCoder.parse()
  let html = bbCoder.html()
  expect(html).toBe('<u>这<i>是什<span style=\"color: #fff;\">么<span style=\"font-size: 24px;\">啊</span></span></i></u>');
});

test('[u]这[/u][i]', () => {
  let bbCoder = new BBCoder('[u]这[/u][i]')
  bbCoder.parse()
  let html = bbCoder.html()
  expect(html).toBe('<u>这</u>[i]');
});

test('[u]这[/u][i] ignoreUncloseTag', () => {
  let bbCoder = new BBCoder('[u]这[/u][i]',{
    ignoreUncloseTag: true
  })
  bbCoder.parse()
  let html = bbCoder.html()
  expect(html).toBe('<u>这</u>');
});


test('[u]这[/i][i]', () => {
  let bbCoder = new BBCoder('[u]这[/i][i]',{
    outputUncloseTag:true
  })
  bbCoder.parse()
  let html = bbCoder.html()
  expect(html).toBe('[u]这[/i][i]');
});


test('复杂文本-1', () => {
  let bbCoder = new BBCoder(`[quote]Originally posted by [i]取决于你[/i] at 2012-1-13 20:10:
  ↵[color=Navy][size=4]    1996年买的第1辆轻骑雄风100摩托车[/color]，
  ↵  [size=4] 2000年骑它去了延安 陕北民风淳朴 主要小吃有：岐山臊子面  杨凌蘸水面 荞面 油泼面
  ↵   2001年去内蒙古左旗，2002年去内蒙临河 ... [/quote]
  ↵好车#003#`,{
    ignoreUncloseTag: true
  })
  bbCoder.parse()
  let html = bbCoder.html()
  expect(html).toBe(`<blockquote><p>Originally posted by <i>取决于你</i> at 2012-1-13 20:10:
  ↵<span style=\"color: Navy;\">    1996年买的第1辆轻骑雄风100摩托车</span>，
  ↵   2000年骑它去了延安 陕北民风淳朴 主要小吃有：岐山臊子面  杨凌蘸水面 荞面 油泼面
  ↵   2001年去内蒙古左旗，2002年去内蒙临河 ... </p></blockquote>
  ↵好车#003#`);
});

test('复杂文本-2', () => {
  let bbCoder = new BBCoder(`[quote]Originally posted by [i]取决于你[/i] at 2012-1-13 20:10:
  ↵[color=Navy][size=4]    1996年买的第1辆轻骑雄风100摩托车[/color]，
  ↵  [size=4] 2000年骑它去了延安 陕北民风淳朴 主要小吃有：岐山臊子面  杨凌蘸水面 荞面 油泼面
  ↵   2001年去内蒙古左旗，2002年去内蒙临河 ... [/quote]
  ↵好车#003#`,{
    outputUncloseTag: true
  })
  bbCoder.parse()
  let html = bbCoder.html()
  expect(html).toBe(`<blockquote><p>Originally posted by <i>取决于你</i> at 2012-1-13 20:10:
  ↵<span style=\"color: Navy;\">[size=4]    1996年买的第1辆轻骑雄风100摩托车</span>，
  ↵  [size=4] 2000年骑它去了延安 陕北民风淳朴 主要小吃有：岐山臊子面  杨凌蘸水面 荞面 油泼面
  ↵   2001年去内蒙古左旗，2002年去内蒙临河 ... </p></blockquote>
  ↵好车#003#`);
});



test('自定义标签解析-1', () => {
  let bbCoder = new BBCoder('[q]1[/q]')
  bbCoder.parse()
  let html = bbCoder.html({
    q(node,results){
    return `<div>自定义标签解析${results.join('')}</div>`
    }
  })
  expect(html).toBe(`<div>自定义标签解析1</div>`);
});


