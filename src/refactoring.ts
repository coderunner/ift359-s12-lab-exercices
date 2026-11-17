//---------------------------------------------------------------------------------------------------
// Partie 1
//---------------------------------------------------------------------------------------------------

export interface Transaction {
  readonly id: string;
  readonly type: "depot" | "retrait";
  readonly montant: number;
}

export function calculerFraisRetraitsImperatif(transactions: readonly Transaction[]): number {
  let totalFrais = 0;

  for (let i = 0; i < transactions.length; i++) {
    const tx = transactions[i];
    if (tx.type === "retrait") {
      const frais = 2 + tx.montant * 0.01;
      if (tx.montant > 0) {
        totalFrais += frais;
      }
    }
  }

  return totalFrais;
}

//---------------------------------------------------------------------------------------------------
// Identifier les étapes suivantes dans le code ci-dessus :
//     - énumération
//     - filtre
//     - transformation
//     - accumulation
//
// Écrire la version fonctionnelle en utilisant les opérations sur le tableau (filter, map, reduce).
//---------------------------------------------------------------------------------------------------

export function calculerFraisRetraitsFonctionnel(transactions: readonly Transaction[]): number {
  return 0; // À faire
}

//---------------------------------------------------------------------------------------------------
// Partie 2
//---------------------------------------------------------------------------------------------------

export interface LigneCommande {
  readonly categorie: "electronique" | "livres" | "vetements";
  readonly prixUnitaire: number;
  readonly quantite: number;
  readonly rabaisPourcent?: number; // Ex: 10 pour 10% de rabais
}

export interface Commande {
  readonly id: string;
  readonly statut: "en_cours" | "livree" | "annulee";
  readonly lignes: readonly LigneCommande[];
}

export function revenusParCategorieImperatif(commandes: readonly Commande[]): Record<string, number> {
  const revenus: Record<string, number> = {};

  for (let i = 0; i < commandes.length; i++) {
    const cmd = commandes[i];

    if (cmd.statut === "livree") {
      for (let j = 0; j < cmd.lignes.length; j++) {
        const ligne = cmd.lignes[j];

        if (ligne.quantite > 0) {
          const rabais = ligne.rabaisPourcent ?? 0;
          const sousTotal = ligne.prixUnitaire * ligne.quantite * (1 - rabais / 100);

          const totalActuel = revenus[ligne.categorie] ?? 0;
          revenus[ligne.categorie] = totalActuel + sousTotal;
        }
      }
    }
  }

  return revenus;
}

//---------------------------------------------------------------------------------------------------
// Identifier les étapes suivantes dans le code ci-dessus :
//     - énumération
//     - filtre
//     - transformation
//     - accumulation
//
// Écrire la version fonctionnelle en utilisant les opérations sur le tableau (filter, flatMap, map, reduce).
//---------------------------------------------------------------------------------------------------

export function revenusParCategorieFonctionnel(commandes: readonly Commande[]): Record<string, number> {
  return {}; // À faire
}

//---------------------------------------------------------------------------------------------------
// Question bonus : Que ferait-on si on avait besoin de l'objet commande dans le reduce final ?
//---------------------------------------------------------------------------------------------------
