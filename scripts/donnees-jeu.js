const niveaux = [
    {
        titre: "Premier trajet",
        rails: ["h", "courbeHG", "courbeHD"],
        puzzles: [
            {
                lignes: 2,
                colonnes: 5,
                depart: 5,
                arrivee: 9,
                fixes: {
                    1: "courbeBD",
                    3: "courbeBG"
                },
                solution: {
                    2: "h",
                    6: "courbeHG",
                    8: "courbeHD"
                }
            },

            {
                lignes: 2,
                colonnes: 5,
                depart: 0,
                arrivee: 4,
                fixes: {
                    8: "courbeHG",
                    3: "courbeBD"
                },
                solution: {
                    5: "courbeHD",
                    6: "h",
                    7: "h"
                }
            },

            {
                lignes: 3,
                colonnes: 5,
                depart: 10,
                arrivee: 4,
                fixes: {
                    7: "v",
                    2: "courbeBD"
                },
                solution: {
                    11: "h",
                    12: "courbeHG",
                    3: "h"
                }
            }
        ]
    },

    {
        titre: "Premier virage",
        rails: ["h", "v", "courbeHD", "courbeBG", "courbeHG"],
        puzzles: [
            {
                lignes: 4,
                colonnes: 5,
                depart: 5,
                arrivee: 19,
                fixes: {},
                solution: {
                    6: "h",
                    7: "courbeBG",
                    12: "v",
                    17: "courbeHD",
                    18: "h"
                }
            },

            {
                lignes: 4,
                colonnes: 5,
                depart: 15,
                arrivee: 4,
                fixes: {
                    2: "courbeBD"
                },
                solution: {
                    16: "h",
                    17: "courbeHG",
                    12: "v",
                    7: "v",
                    3: "h"
                }
            },

            {
                lignes: 4,
                colonnes: 6,
                depart: 18,
                arrivee: 5,
                fixes: {
                    2: "courbeBD",
                    4: "h"
                },
                solution: {
                    19: "h",
                    20: "courbeHG",
                    14: "v",
                    8: "v",
                    3: "h"
                }
            }
        ]
    },

    {
        titre: "Dernier trajet",
        rails: ["h", "v", "courbeHD", "courbeBD", "courbeBG", "courbeHG"],
        puzzles: [
            {
                lignes: 5,
                colonnes: 6,
                depart: 6,
                arrivee: 29,
                fixes: {},
                solution: {
                    7: "h",
                    8: "courbeBG",
                    14: "v",
                    20: "v",
                    26: "courbeHD",
                    27: "h",
                    28: "h"
                }
            },

            {
                lignes: 5,
                colonnes: 6,
                depart: 24,
                arrivee: 5,
                fixes: {
                    14: "v"
                },
                solution: {
                    25: "h",
                    26: "courbeHG",
                    20: "v",
                    8: "v",
                    2: "courbeBD",
                    3: "h",
                    4: "h"
                }
            },

            {
                lignes: 5,
                colonnes: 7,
                depart: 28,
                arrivee: 6,
                fixes: {
                    23: "v",
                    4: "h"
                },
                solution: {
                    29: "h",
                    30: "courbeHG",
                    16: "v",
                    9: "v",
                    2: "courbeBD",
                    3: "h",
                    5: "h"
                }
            }
        ]
    }
];

const railsVerticaux = [
    "../images/jeu/rails/vertical/rail-tile.png",
    "../images/jeu/rails/vertical/rail-tile-2.png",
    "../images/jeu/rails/vertical/rail-tile-3.png",
    "../images/jeu/rails/vertical/rail-tile-4.png",
    "../images/jeu/rails/vertical/rail-tile-5.png",
    "../images/jeu/rails/vertical/rail-tile-6.png",
    "../images/jeu/rails/vertical/rail-tile-7.png"
];

const railsHorizontaux = [
    "../images/jeu/rails/horizontal/rail-tile.png",
    "../images/jeu/rails/horizontal/rail-tile-2.png",
    "../images/jeu/rails/horizontal/rail-tile-3.png",
    "../images/jeu/rails/horizontal/rail-tile-4.png",
    "../images/jeu/rails/horizontal/rail-tile-5.png",
    "../images/jeu/rails/horizontal/rail-tile-6.png",
    "../images/jeu/rails/horizontal/rail-tile-7.png"
];

const railCourbeGauche =
    "../images/jeu/rails/courbe/left-curved-rail-minijeu.png";

const railCourbeDroite =
    "../images/jeu/rails/courbe/right-curved-rail-minijeu.png";

const imageTrain =
    "../images/jeu/train-minijeu.png";

const imageGare =
    "../images/jeu/minijeu-gare.png";