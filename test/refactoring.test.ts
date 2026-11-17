import { describe, expect, it } from "vitest";
import {
  calculerFraisRetraitsFonctionnel,
  calculerFraisRetraitsImperatif,
  Commande,
  revenusParCategorieFonctionnel,
  revenusParCategorieImperatif,
  Transaction,
} from "../src/refactoring.js";

describe("Partie 1 — calculerFraisRetraitsFonctionnel", () => {
  it("calcule les frais (2$ + 1%) pour des retraits valides", () => {
    const transactions: readonly Transaction[] = [
      { id: "tx-1", type: "retrait", montant: 100 },
      { id: "tx-2", type: "retrait", montant: 200 },
    ];

    expect(calculerFraisRetraitsFonctionnel(transactions)).toBeCloseTo(calculerFraisRetraitsImperatif(transactions));
  });

  it("ignore les dépôts lors du calcul des frais", () => {
    const transactions: readonly Transaction[] = [
      { id: "tx-1", type: "depot", montant: 1000 },
      { id: "tx-2", type: "retrait", montant: 100 },
      { id: "tx-3", type: "depot", montant: 500 },
    ];

    expect(calculerFraisRetraitsFonctionnel(transactions)).toBeCloseTo(calculerFraisRetraitsImperatif(transactions));
  });

  it("ignore les retraits dont le montant est nul ou négatif", () => {
    const transactions: readonly Transaction[] = [
      { id: "tx-1", type: "retrait", montant: 0 },
      { id: "tx-2", type: "retrait", montant: -50 },
      { id: "tx-3", type: "retrait", montant: 50 },
    ];

    expect(calculerFraisRetraitsFonctionnel(transactions)).toBeCloseTo(calculerFraisRetraitsImperatif(transactions));
  });

  it("produit le même résultat que la version impérative sur un ensemble mixte", () => {
    const transactions: readonly Transaction[] = [
      { id: "tx-1", type: "depot", montant: 1000 },
      { id: "tx-2", type: "retrait", montant: 100 },
      { id: "tx-3", type: "retrait", montant: 250 },
      { id: "tx-4", type: "retrait", montant: 0 },
      { id: "tx-5", type: "retrait", montant: -20 },
      { id: "tx-6", type: "depot", montant: 50 },
      { id: "tx-7", type: "retrait", montant: 50 },
    ];

    expect(calculerFraisRetraitsFonctionnel(transactions)).toBeCloseTo(calculerFraisRetraitsImperatif(transactions));
  });
});

describe("Partie 2 — revenusParCategorieFonctionnel", () => {
  it("accumule les revenus par catégorie pour des commandes livrées sans rabais", () => {
    const commandes: readonly Commande[] = [
      {
        id: "cmd-1",
        statut: "livree",
        lignes: [
          { categorie: "electronique", prixUnitaire: 100, quantite: 2 },
          { categorie: "livres", prixUnitaire: 25, quantite: 2 },
        ],
      },
      {
        id: "cmd-2",
        statut: "livree",
        lignes: [{ categorie: "electronique", prixUnitaire: 50, quantite: 1 }],
      },
    ];

    expect(revenusParCategorieFonctionnel(commandes)).toEqual(revenusParCategorieImperatif(commandes));
  });

  it("applique correctement le pourcentage de rabais lorsqu'il est présent", () => {
    const commandes: readonly Commande[] = [
      {
        id: "cmd-1",
        statut: "livree",
        lignes: [
          {
            categorie: "electronique",
            prixUnitaire: 100,
            quantite: 2,
            rabaisPourcent: 10,
          },
          {
            categorie: "vetements",
            prixUnitaire: 80,
            quantite: 1,
            rabaisPourcent: 25,
          },
        ],
      },
    ];

    expect(revenusParCategorieFonctionnel(commandes)).toEqual(revenusParCategorieImperatif(commandes));
  });

  it("ignore les commandes en cours ou annulées", () => {
    const commandes: readonly Commande[] = [
      {
        id: "cmd-1",
        statut: "en_cours",
        lignes: [{ categorie: "electronique", prixUnitaire: 500, quantite: 2 }],
      },
      {
        id: "cmd-2",
        statut: "annulee",
        lignes: [{ categorie: "livres", prixUnitaire: 30, quantite: 1 }],
      },
      {
        id: "cmd-3",
        statut: "livree",
        lignes: [{ categorie: "livres", prixUnitaire: 20, quantite: 2 }],
      },
    ];

    expect(revenusParCategorieFonctionnel(commandes)).toEqual(revenusParCategorieImperatif(commandes));
  });

  it("ignore les lignes de commande dont la quantité est nulle ou négative", () => {
    const commandes: readonly Commande[] = [
      {
        id: "cmd-1",
        statut: "livree",
        lignes: [
          { categorie: "vetements", prixUnitaire: 40, quantite: 0 },
          { categorie: "vetements", prixUnitaire: 40, quantite: -1 },
          { categorie: "electronique", prixUnitaire: 120, quantite: 1 },
        ],
      },
    ];

    expect(revenusParCategorieFonctionnel(commandes)).toEqual(revenusParCategorieImperatif(commandes));
  });

  it("produit le même résultat que la version impérative sur un lot complet de commandes", () => {
    const commandes: readonly Commande[] = [
      {
        id: "cmd-1",
        statut: "livree",
        lignes: [
          {
            categorie: "electronique",
            prixUnitaire: 100,
            quantite: 2,
            rabaisPourcent: 10,
          },
          { categorie: "livres", prixUnitaire: 25, quantite: 2 },
        ],
      },
      {
        id: "cmd-2",
        statut: "en_cours",
        lignes: [{ categorie: "electronique", prixUnitaire: 1000, quantite: 1 }],
      },
      {
        id: "cmd-3",
        statut: "livree",
        lignes: [
          { categorie: "electronique", prixUnitaire: 50, quantite: 1 },
          {
            categorie: "vetements",
            prixUnitaire: 80,
            quantite: 1,
            rabaisPourcent: 25,
          },
          { categorie: "livres", prixUnitaire: 20, quantite: 0 },
        ],
      },
    ];

    expect(revenusParCategorieFonctionnel(commandes)).toEqual(revenusParCategorieImperatif(commandes));
  });
});
