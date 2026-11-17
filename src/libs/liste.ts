import { assertNever } from "./assert-never.js";
import { none, Option, some } from "./option.js";

export interface Cons<A> {
  readonly tag: "cons";
  readonly tete: A;
  readonly reste: Liste<A>;
}

export interface Nil {
  readonly tag: "nil";
}

export type Liste<A> = Cons<A> | Nil;

export const nil: Nil = Object.freeze({ tag: "nil" });

export function cons<A>(tete: A, reste: Liste<A> = nil): Cons<A> {
  return { tag: "cons", tete, reste };
}

export function estVide<A>(l: Liste<A>): l is Nil {
  return l.tag === "nil";
}

export function estCons<A>(l: Liste<A>): l is Cons<A> {
  return l.tag === "cons";
}

export function tete<A>(l: Cons<A>): A;
export function tete<A>(l: Nil): never;
export function tete<A>(l: Liste<A>): A | null;
export function tete<A>(l: Liste<A>): A | null {
  if (estCons(l)) {
    return l.tete;
  }
  return null;
}

export function reste<A>(l: Cons<A>): Liste<A>;
export function reste<A>(l: Nil): never;
export function reste<A>(l: Liste<A>): Liste<A>;
export function reste<A>(l: Liste<A>): Liste<A> {
  if (estCons(l)) {
    return l.reste;
  }
  return nil;
}

export function longueur<A>(l: Liste<A>): number {
  function iter(courante: Liste<A>, acc: number): number {
    switch (courante.tag) {
      case "nil":
        return acc;
      case "cons":
        return iter(courante.reste, acc + 1);
      default: {
        return assertNever(courante);
      }
    }
  }
  return iter(l, 0);
}

export function trouver<A>(l: Liste<A>, p: (a: A) => boolean): Option<A> {
  switch (l.tag) {
    case "nil":
      return none;
    case "cons": {
      if (p(l.tete)) return some(l.tete);
      return trouver(l.reste, p);
    }
    default: {
      return assertNever(l);
    }
  }
}

export function filter<A>(l: Liste<A>, p: (x: A) => boolean): Liste<A> {
  switch (l.tag) {
    case "nil":
      return nil;
    case "cons":
      return p(l.tete) ? cons(l.tete, filter(l.reste, p)) : filter(l.reste, p);
    default: {
      return assertNever(l);
    }
  }
}

export function fold<A, R>(
  l: Liste<A>,
  op: (acc: R, val: A) => R,
  initial: R,
): R {
  switch (l.tag) {
    case "nil":
      return initial;
    case "cons":
      return fold(l.reste, op, op(initial, l.tete));
    default: {
      return assertNever(l);
    }
  }
}
