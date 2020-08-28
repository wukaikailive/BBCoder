import ASTParser from '../src/ASTParser';

test('[u]abc[/u]', () => {
  let parser = new ASTParser('[u]abc[/u]');
  parser.tokenizer();
  expect(parser.tokens[0].value).toBe('u');
});

test('[u]abc[/u][i]123[/i]', () => {
  let parser = new ASTParser('[u]abc[/u][i]123[/i]');
  parser.tokenizer();
  expect(parser.tokens[0].value).toBe('u');
});
test('[u]abc[/u][a][i]123[/i]', () => {
  let parser = new ASTParser('[u]abc[/u][a][i]123[/i]');
  parser.tokenizer();
  expect(parser.tokens[0].value).toBe('u');
});

test('[u]abc[/u] parser', () => {
  let parser = new ASTParser('[u]abc[/u]');
  parser.tokenizer();
  parser.parser();
  expect(parser.tokens[0].value).toBe('u');
});

test('[u]abc[/u] [i]123[/i]parser', () => {
  let parser = new ASTParser('[u]abc[/u][i]123[/i]');
  parser.tokenizer();
  parser.parser();
  expect(parser.tokens[0].value).toBe('u');
});

test('[u]abc[/u][a]i]123[/i]parser', () => {
  let parser = new ASTParser('[u]abc[/u][a][i]123[/i]');
  parser.tokenizer();
  parser.parser();
  expect(parser.tokens[0].value).toBe('u');
});

test('[u]abc[/u][a][i][/a]123[/i]parser', () => {
  let parser = new ASTParser('[u]abc[/u][a][i][/a]123[/i]',{
    outputUncloseTag:true
  });
  parser.tokenizer();
  parser.parser();
  expect(parser.tokens[0].value).toBe('u');
});

