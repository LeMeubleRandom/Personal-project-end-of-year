export default async function execute(game, player, payload) {
  const { discardCardHandIndex, targetGraveyardCardId } = payload;

  if (discardCardHandIndex === undefined || discardCardHandIndex === null) {
    throw new Error("Vous devez choisir une carte à défausser.");
  }
  if (targetGraveyardCardId === undefined || targetGraveyardCardId === null) {
    throw new Error("Vous devez choisir un Être du cimetière à réinvoquer.");
  }

  // 1. Défausser la carte
  const discardIndex = Number(discardCardHandIndex);
  if (discardIndex < 0 || discardIndex >= player.hand.length) {
    throw new Error("Carte à défausser invalide.");
  }
  const discardedCard = player.hand.splice(discardIndex, 1)[0];
  player.graveyard.push(discardedCard);

  // 2. Trouver la carte à réinvoquer dans le cimetière
  const graveyardIndex = player.graveyard.findIndex((c) => c.id === Number(targetGraveyardCardId));
  if (graveyardIndex === -1) {
    throw new Error("La carte cible n'est pas dans votre cimetière.");
  }

  const cardToRevive = player.graveyard[graveyardIndex];
  if (cardToRevive.type !== "Être") {
    throw new Error("Vous ne pouvez réinvoquer qu'un Être.");
  }

  // Vérifier si la zone d'êtres a de la place
  const activeBeings = player.mainZone.filter((c) => c !== null);
  if (activeBeings.length >= 5) {
    throw new Error("Zone d'êtres pleine.");
  }

  // Trouver un emplacement libre
  const searchOrder = [2, 1, 3, 0, 4];
  let targetSlot = -1;
  for (const i of searchOrder) {
    if (player.mainZone[i] === null) {
      targetSlot = i;
      break;
    }
  }

  if (targetSlot === -1) {
    throw new Error("Aucun emplacement libre sur le terrain.");
  }

  // Retirer du cimetière et mettre en jeu avec 1 PV
  player.graveyard.splice(graveyardIndex, 1);
  cardToRevive.currentPv = 1;
  cardToRevive.hasAttacked = false;
  player.mainZone[targetSlot] = cardToRevive;

  console.log(`${player.name} défausse ${discardedCard.name} et réinvoque ${cardToRevive.name} avec 1 PV.`);
  return { success: true, message: `${player.name} a défaussé ${discardedCard.name} et réinvoqué ${cardToRevive.name} avec 1 PV.` };
}
