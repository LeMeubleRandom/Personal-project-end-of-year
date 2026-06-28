export default async function execute(game, player, payload) {
  await player.drawOne();
  await player.drawOne();
  console.log(
    `${player.name} a activé l'effet de Pot of Greed et pioché 2 cartes.`,
  );
  return {
    success: true,
    message: `${player.name} a pioché 2 cartes grâce à Pot of Greed.`,
  };
}
