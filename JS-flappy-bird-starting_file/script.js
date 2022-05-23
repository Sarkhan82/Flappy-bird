const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const img = new Image();
img.src = "./media/flappy-bird-set.png";

// general settings
let gamePlaying = false; // variable pour savoir si on joue ou non
const gravity = 0.5;
const speed = 6.2; // permet de faire venir les poteaux vers l'oiseau
// l'oiseau ne bouge pas
const size = [51, 36]; // taille de notre oioseau
const jump = -11.5; // permet de régler la difficulté
const cTenth = canvas.width / 10;

// pipe settings
const pipeWidth = 78;
const pipeGap = 270; // l'écart entre les poteaux
const pipeLoc = () =>
  Math.random() * (canvas.height - (pipeGap + pipeWidth) - pipeWidth) +
  pipeWidth; // va faire en sorte de donner des tailles diférentes au poto

let index = 0, // gère le mouvement du fond
  bestScore = 0,
  currentScore = 0,
  pipes = [], // les poteaux en tableau qu'on fera pop
  // de façon aléatoires
  flight,
  flyHeight;

const setup = () => {
  // relance les score au démarage ou chargement de la page
  currentScore = 0;
  flight = jump;
  flyHeight = canvas.height / 2 - size[1] / 2; // pour centrer l'oiseau
  pipes = Array(3) // permet de creer des tableaux avec des valeurs différentes
    .fill()
    .map((a, i) => [canvas.width + i * (pipeGap + pipeWidth), pipeLoc()]);
};

// on va commmencer à faire du rendu

const render = () => {
  index++;

  // BACKGROUND
  ctx.drawImage(
    img,
    0,
    0,
    canvas.width,
    canvas.height,
    -((index * (speed / 2)) % canvas.width) + canvas.width,
    0, // les 2 dernière commandes vont nous permettre de faire venir
    // le fond de la droite vers la gauche
    canvas.width,
    canvas.height
  );
  ctx.drawImage(
    // on va injecter une deuxième image légèrement décallé
    // pour enlever cette effet de superpositon
    img,
    0,
    0,
    canvas.width,
    canvas.height,
    -((index * (speed / 2)) % canvas.width),
    0,
    canvas.width,
    canvas.height
  );

  // BIRD
  if (gamePlaying) {
    ctx.drawImage(
      img,
      432,
      Math.floor((index % 9) / 3) * size[1],
      ...size,
      cTenth,
      flyHeight,
      ...size
    );
    // revient a gameplaying === true
    flight += gravity; // pour lancer la gravité sur l'oiseau
    flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);
    // fait en sorte que l'oiseau retombe et la valeur -1 et le mathMin
    // permet qu'il ne sorte pas du canva
  } else {
    ctx.drawImage(
      // on va découper notre oiseau avec les 4 premiers paramètre
      // et le placer ou l'on souhaite dans notre canvas avec les 4 autres
      // paramètres.
      img,
      432,
      Math.floor((index % 9) / 3) * size[1], // permet de faire battre
      // des ailes notre oiseau en faite grace à cette ligne il va choisir
      // aléatoirement entre les 3 oiseux du notre img (il découpera jamais le même)
      ...size,
      canvas.width / 2 - size[0] / 2,
      flyHeight,
      ...size
    );
    flyHeight = canvas.height / 2 - size[1] / 2; // on doit donner une valeur
    // on calcul la moitié du canvas pour le placer au centre

    // ecrire dans le canva
    ctx.fillText(`Meilleur score : ${bestScore}`, 55, 245);
    // on doit le placer dans le canvas avec les valeurs après ce que l'on
    // veut écrie
    ctx.fillText("Cliquez pour jouer", 48, 535);
    ctx.font = "bold 30px courier";
    // on peut modifier la font ensuite
  }

  // PIPE DISPLAY

  if (gamePlaying) {
    pipes.map((pipe) => {
      pipe[0] -= speed;

      // Top pipe
      ctx.drawImage(
        img,
        432,
        588 - pipe[1],
        pipeWidth,
        pipe[1],
        pipe[0],
        0,
        pipeWidth,
        pipe[1]
      );

      // bottom pipe
      ctx.drawImage(
        img,
        432 + pipeWidth,
        108,
        pipeWidth,
        canvas.height - pipe[1] + pipeGap,
        pipe[0],
        pipe[1] + pipeGap,
        pipeWidth,
        canvas.height - pipe[1] + pipeGap
      );

      if (pipe[0] <= -pipeWidth) {
        // si le poto sort du canvas
        currentScore++; // augmente le score
        bestScore = Math.max(bestScore, currentScore);
        // best score devient le meilleur entre current et best

        // Remove pipe and create new one
        pipes = [
          ...pipes.slice(1), // on reprend notre tableau on lui enlève
          //le 1er element
          [pipes[pipes.length - 1][0] + pipeGap + pipeWidth, pipeLoc()],
          // on point le dernière element // on creer notre nouvelle
          // argument dans lequelle on ajoute les valeurs dynamique
        ];
      }
      // if hit the pipe, END
      // il faut être dans le map de notre tableau
      if (
        [
          pipe[0] <= cTenth + size[0],
          // axe des Y pipe supérieur ou égal à valeur de notre oiseau
          pipe[0] + pipeWidth >= cTenth,
          // cTenth représente notre oiseau
          // avec ces 2 conditions on teste si l'oiseau est dans un des 2
          // potos
          pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1],
          // test si on passe dans le gap
        ].every((elem) => elem) // every test toutes les conditions
      ) {
        gamePlaying = false;
        setup();
      }
    });
  }

  // affichage des scores dynamiquement
  document.getElementById("bestScore").innerHTML = `Meilleur : ${bestScore}`;
  document.getElementById(
    "currentScore"
  ).innerHTML = `Actuel : ${currentScore}`;

  window.requestAnimationFrame(render); // va nous permettre de relancer
  // le rendu en boucle
};
setup();
img.onload = render; // lance le rendu au chargement de la page
// en allant récup les img

document.addEventListener("click", () => (gamePlaying = true));
// pour lancer le jeu au click en changeant le boolean de notre variable

window.onclick = () => (flight = jump);
// va nous permettre de faire faire un saut au démarrage pour pouvoir lancer
// la gravité sur l'oiseau et du coup à chaque fois qu'on click il va sauter
