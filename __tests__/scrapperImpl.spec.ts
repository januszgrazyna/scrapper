import { parseScrapperOptions } from '../src/scrapper/ScrapperImpl';

test('Options parser test', () => {
  interface Opt {
    opt1: number;
    opt2: string;
  }
  const argv = { "name-opt1": 123, "name-opt2": "40", "ignored": 20 };

  const result: any = parseScrapperOptions<Opt>("name", argv);

  expect(result.opt1).toBe(123);
  expect(result.opt2).toBe("40");
  expect(result['ignored']).toBe(undefined);
})
