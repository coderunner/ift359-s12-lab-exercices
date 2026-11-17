import * as Stream from "./libs/stream.js";
import * as Liste from "./libs/liste.js";
import { filter, scan, Subject } from "rxjs";

// Q1
export function enumererIntervalle(a: number, b: number): Liste.Liste<number> {
  if (a > b) {
    return Liste.nil;
  }
  return Liste.cons(a, enumererIntervalle(a + 1, b));
}

// CODE 3
export function entiersDepuis(n: number): Stream.Stream<number> {
  return Stream.cons(n, () => entiersDepuis(n + 1));
}

const s = Stream.map(
  Stream.filter(entiersDepuis(1), (x) => {
    console.log(`F:${x}`);
    return x % 2 === 0;
  }),
  (x) => {
    console.log(`M:${x}`);
    return x * 10;
  },
);

const res = Stream.take(s, 2);
console.log(res);

// CODE 4
const impairs = Stream.filter(entiersDepuis(1), (x) => x % 2 !== 0);
const impossible = Stream.filter(impairs, (x) => x % 2 === 0);

// CODE 5
const mouvements$ = new Subject<number>();

const resultat$ = mouvements$.pipe(
  filter((x) => x !== 0),
  scan((acc, val) => acc + val, 10),
);

resultat$.subscribe((v) => console.log(v));

mouvements$.next(5);
mouvements$.next(0);
mouvements$.next(-3);
