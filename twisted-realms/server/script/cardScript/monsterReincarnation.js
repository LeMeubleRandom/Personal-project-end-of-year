export default async function execute(game, player, payload) {
  const { targetGraveyardCardId } = payload;
  if (targetGraveyardCardId === undefined || targetGraveyardCardId === null) {
    throw new Error("Vous devez choisir un Être du cimetière à invoquer.");
  }

  const graveyardIndex = player.graveyard.findIndex(
    (c) => c.id === Number(targetGraveyardCardId),
  );
  if (graveyardIndex === -1) {
    throw new Error("La carte sélectionnée n'est pas dans votre cimetière.");
  }

  const card = player.graveyard[graveyardIndex];
  if (card.type !== "Être") {
    throw new Error("Vous ne pouvez réinvoquer qu'un Être.");
  }

  const activeBeings = player.mainZone.filter((c) => c !== null);
  if (activeBeings.length >= 5) {
    throw new Error("Votre zone d'êtres est pleine.");
  }

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

  player.graveyard.splice(graveyardIndex, 1);
  card.currentPv = card.pv;
  card.hasAttacked = false;
  player.mainZone[targetSlot] = card;

  console.log(`${player.name} a réinvoqué ${card.name} sur le terrain.`);
  return {
    success: true,
    message: `${player.name} a réinvoqué ${card.name} depuis le cimetière.`,
  };
}
