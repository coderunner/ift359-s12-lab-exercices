import { describe, expect, it } from "vitest";
import { estCons, take } from "../src/libs/stream.js";
import { carresMultiplesDeTrois, quatrePremiersElements, solutionsEtages, somme } from "../src/streams.js";

describe("Flots (Streams)", () => {
  describe("Partie 1 — carresMultiplesDeTrois", () => {
    it("est un flot non vide contenant les carrés des multiples de 3", () => {
      expect(estCons(carresMultiplesDeTrois)).toBe(true);
      expect(take(carresMultiplesDeTrois, 6)).toEqual([9, 36, 81, 144, 225, 324]);
    });
  });

  describe("Partie 2 — quatrePremiersElements", () => {
    it("contient les 4 premiers éléments de carresMultiplesDeTrois", () => {
      expect(quatrePremiersElements).toEqual([9, 36, 81, 144]);
    });
  });

  describe("Partie 3 — somme", () => {
    it("calcule la somme des éléments de carresMultiplesDeTrois strictement inférieurs à 200", () => {
      // 9 + 36 + 81 + 144 = 270 (le suivant est 225 >= 200)
      expect(somme).toBe(270);
    });
  });

  describe("Partie 4 — solutionsEtages (permutations et filtrage)", () => {
    it("trouve la première solution valide du flot sans évaluer tout le reste", () => {
      expect(take(solutionsEtages, 1)).toEqual([{ alice: 1, bob: 2, charlie: 4, diane: 3, eric: 5 }]);
    });

    it("filtre correctement l'ensemble des permutations pour ne garder que les 5 réponses valides", () => {
      expect(take(solutionsEtages, 10)).toEqual([
        { alice: 1, bob: 2, charlie: 4, diane: 3, eric: 5 },
        { alice: 1, bob: 2, charlie: 4, diane: 5, eric: 3 },
        { alice: 1, bob: 4, charlie: 2, diane: 5, eric: 3 },
        { alice: 3, bob: 2, charlie: 4, diane: 5, eric: 1 },
        { alice: 3, bob: 4, charlie: 2, diane: 5, eric: 1 },
      ]);
    });
  });
});
