import { cons, estVide, filter, flatMap, fold, map, nil, Stream, take, takeWhile } from "./libs/stream.js";

export function entiersDepuis(n: number): Stream<number> {
  return cons(n, () => entiersDepuis(n + 1));
}

//---------------------------------------------------------------------------------------------------
// Partie 1 — Construction d'un flot infini
//---------------------------------------------------------------------------------------------------
// On souhaite manipuler la suite infinie des carrés des multiples de 3 à partir de 1 :
// [9, 36, 81, 144, ...].
//
// En utilisant entiersDepuis(1), filter et map, construisez le flot infini
// carresMultiplesDeTrois: Stream<number>.
//---------------------------------------------------------------------------------------------------

export const carresMultiplesDeTrois: Stream<number> = nil; // À faire

//---------------------------------------------------------------------------------------------------
// Partie 2 — Extraction d'un nombre fini d'éléments
//---------------------------------------------------------------------------------------------------
// Extraire dans un tableau les 4 premiers éléments de carresMultiplesDeTrois.
//---------------------------------------------------------------------------------------------------

export const quatrePremiersElements: readonly number[] = []; // À faire

//---------------------------------------------------------------------------------------------------
// Partie 3 — Accumulation
//---------------------------------------------------------------------------------------------------
// Calculer la somme de tous les éléments de carresMultiplesDeTrois qui sont
// strictement inférieurs à 200.
//---------------------------------------------------------------------------------------------------

export const somme: number = 0; // À faire

//---------------------------------------------------------------------------------------------------
// Partie 4 — Génération et filtrage de permutations
//---------------------------------------------------------------------------------------------------
// Les fonctions suivantes permettent de générer paresseusement toutes les permutations
// possibles d'un tableau sous la forme d'un flot (Stream).
//---------------------------------------------------------------------------------------------------

// Convertit un tableau en Stream.
export function streamDeTableau<A>(elements: readonly A[]): Stream<A> {
  function depuis(index: number): Stream<A> {
    if (index >= elements.length) {
      return nil;
    }
    return cons(elements[index], () => depuis(index + 1));
  }
  return depuis(0);
}

// Génère toutes les permutations possibles d'un flot sous la forme d'un flot (Stream).
export function permutations<A>(s: Stream<A>): Stream<readonly A[]> {
  if (estVide(s)) {
    return cons([], () => nil);
  }
  return flatMap(s, (choix) => {
    // pour chaque élément du stream initial, on enlève cet élément
    const restants = filter(s, (x) => x !== choix);
    // on place le choix en début et ajoute les permutations des éléments restants
    // autrement dit, on génère toutes les permutations avec ce choix en première position
    return map(permutations(restants), (perm) => [choix, ...perm]);
  });
}

//---------------------------------------------------------------------------------------------------
// Énoncé du problème :
// Cinq personnes (Alice, Bob, Charlie, Diane et Éric) habitent dans un immeuble de 5 étages
// numérotés de 1 à 5. Chaque personne occupe un étage distinct.
//
// En partant du flot de toutes les permutations possibles `permutations(streamDeTableau([1, 2, 3, 4, 5]))`,
// transformez chaque permutation `[alice, bob, charlie, diane, eric]` en un objet
// `AttributionEtages`, puis filtrez le flot pour ne conserver que les réponses qui respectent
// toutes les contraintes suivantes :
//   1. Alice n'habite pas au 5e étage.
//   2. Bob n'habite pas au 1er étage.
//   3. Charlie n'habite ni au 1er ni au 5e étage.
//   4. Diane habite à un étage strictement supérieur à celui de Bob.
//   5. Charlie n'habite pas à un étage adjacent à celui de Bob.
//---------------------------------------------------------------------------------------------------

export interface AttributionEtages {
  readonly alice: number;
  readonly bob: number;
  readonly charlie: number;
  readonly diane: number;
  readonly eric: number;
}

export const solutionsEtages: Stream<AttributionEtages> = nil; // À faire
