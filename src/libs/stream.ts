import { assertNever } from "./assert-never.js";
import { none, Option, some } from "./option.js";

export interface Cons<A> {
  readonly tag: "cons";
  readonly tete: A;
  readonly reste: () => Stream<A>;
}

export interface Nil {
  readonly tag: "nil";
}

export type Stream<A> = Cons<A> | Nil;

export const nil: Nil = Object.freeze({ tag: "nil" });

export function cons<A>(tete: A, reste: () => Stream<A> = () => nil): Cons<A> {
  return { tag: "cons", tete, reste };
}

export function estVide<A>(s: Stream<A>): s is Nil {
  return s.tag === "nil";
}

export function estCons<A>(s: Stream<A>): s is Cons<A> {
  return s.tag === "cons";
}

export function tete<A>(s: Cons<A>): A;
export function tete<A>(s: Nil): never;
export function tete<A>(s: Stream<A>): A | null;
export function tete<A>(s: Stream<A>): A | null {
  if (estCons(s)) {
    return s.tete;
  }
  return null;
}

export function reste<A>(s: Cons<A>): Stream<A>;
export function reste<A>(s: Nil): never;
export function reste<A>(s: Stream<A>): Stream<A>;
export function reste<A>(s: Stream<A>): Stream<A> {
  if (estCons(s)) {
    return s.reste();
  }
  return nil;
}

export function take<A>(s: Stream<A>, n: number): readonly A[] {
  if (n <= 0) {
    return [];
  }
  switch (s.tag) {
    case "nil":
      return [];
    case "cons":
      return [s.tete, ...take(s.reste(), n - 1)];
    default:
      return assertNever(s);
  }
}

export function takeWhile<A>(s: Stream<A>, p: (val: A) => boolean): Stream<A> {
  switch (s.tag) {
    case "nil":
      return nil;
    case "cons":
      if (p(s.tete)) {
        return cons(s.tete, () => takeWhile(s.reste(), p));
      }
      return nil;
  }
}

export function trouver<A>(s: Stream<A>, p: (a: A) => boolean): Option<A> {
  switch (s.tag) {
    case "nil":
      return none;
    case "cons":
      if (p(s.tete)) {
        return some(s.tete);
      }
      return trouver(s.reste(), p);
    default:
      return assertNever(s);
  }
}

export function map<A, B>(s: Stream<A>, op: (val: A) => B): Stream<B> {
  switch (s.tag) {
    case "nil":
      return nil;
    case "cons":
      return cons(op(s.tete), () => map(s.reste(), op));
    default:
      return assertNever(s);
  }
}

export function filter<A>(s: Stream<A>, p: (x: A) => boolean): Stream<A> {
  function prochain(courant: Stream<A>): Stream<A> {
    switch (courant.tag) {
      case "nil":
        return nil;
      case "cons":
        if (p(courant.tete)) {
          return cons(courant.tete, () => filter(courant.reste(), p));
        }
        return prochain(courant.reste()); // Limitation car la tete de la liste est stricte (déjà calculée)
      default:
        return assertNever(courant);
    }
  }

  return prochain(s);
}

export function concatStream<A>(s1: Stream<A>, s2: () => Stream<A>): Stream<A> {
  switch (s1.tag) {
    case "nil":
      return s2();
    case "cons":
      return cons(s1.tete, () => concatStream(s1.reste(), s2));
    default:
      return assertNever(s1);
  }
}

export function flatMap<A, B>(s: Stream<A>, op: (val: A) => Stream<B>): Stream<B> {
  switch (s.tag) {
    case "nil":
      return nil;
    case "cons": {
      const sousFlux = op(s.tete);
      // Concaténation paresseuse du sous-flux avec la suite du flatMap
      return concatStream(sousFlux, () => flatMap(s.reste(), op));
    }
    default:
      return assertNever(s);
  }
}

// fold et foldRight, à n'utiliser que sur des flux finis.
export function fold<A, R>(s: Stream<A>, initial: R, combiner: (acc: R, val: A) => R): R {
  switch (s.tag) {
    case "nil":
      return initial;
    case "cons":
      return fold(s.reste(), combiner(initial, s.tete), combiner);
    default:
      return assertNever(s);
  }
}

export function foldRight<A, R>(s: Stream<A>, op: (val: A, acc: R) => R, initial: R): R {
  switch (s.tag) {
    case "nil":
      return initial;
    case "cons":
      return op(s.tete, foldRight(s.reste(), op, initial));
    default:
      return assertNever(s);
  }
}

export function combinerStream<A, B, C>(s1: Stream<A>, s2: Stream<B>, op: (a: A, b: B) => C): Stream<C> {
  if (estVide(s1) || estVide(s2)) {
    return nil;
  }
  return cons(op(s1.tete, s2.tete), () => combinerStream(s1.reste(), s2.reste(), op));
}
