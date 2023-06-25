const app = new Vue({
  el: '#app',
  data: {
    gameStarted: false,
    flippedCards: [],
  },
  methods: {
    startGame() {
      this.gameStarted = true;

      const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        backgroundColor: '#ffffff',
        parent: 'game-container',
        scene: {
          preload() {
            this.load.image('card', './resources/back.png');
            this.load.image('image1', './resources/cb.png');
            this.load.image('image2', './resources/co.png');
            this.load.image('image3', './resources/sb.png');
            this.load.image('image4', './resources/so.png');
            this.load.image('image5', './resources/tb.png');
            //Falta 1
          },
          create() {
            const images = ['image1', 'image2', 'image3', 'image4', 'image5'];

            for (let i = 0; i < images.length; i++) {
              const image = images[i];

              if (!this.textures.exists(image)) {
                console.error(`Error: Failed to load image ${image}. Make sure the path is correct.`);
              }
            }

            const cards = [];

            // Duplicar las cartas y mezclarlas
            const shuffledImages = Phaser.Math.RND.shuffle([...images, ...images]);
            const cardBack = this.add.image(0, 0, 'card').setOrigin(0, 0);
    
            //Posicionarlas
            const gridWidth = 3;
            const cardSpacing = 20;
            const cardWidth = cardBack.width;
            const cardHeight = cardBack.height;
            const startX = (config.width - (gridWidth * cardWidth + (gridWidth - 1) * cardSpacing)) / 2;
            const startY = (config.height - (2 * cardHeight + cardSpacing)) / 2;

            //Mostrar...
            const revealCard = (card) => {
              card.setTexture(card.textureKey);
              card.isFlipped = true;
            };

            //Colocar del revés
            const hideCard = (card) => {
              card.setTexture('card');
              card.isFlipped = false;
            };

            //Comprobar si iguales (working progress) error consola? mover fuera de create? 
            const checkMatch = () => {
              if (this.flippedCards.length === 2) {
                const [card1, card2] = this.flippedCards;
                if (card1.textureKey === card2.textureKey) {
                  card1.removeInteractive();
                  card2.removeInteractive();
                } else {
                  setTimeout(() => {
                    hideCard(card1);
                    hideCard(card2);
                  }, 500);
                }
                this.flippedCards = [];
              }
            };

            
            for (let i = 0; i < shuffledImages.length; i++) {
              const row = Math.floor(i / gridWidth);
              const col = i % gridWidth;

              const x = startX + col * (cardWidth + cardSpacing);
              const y = startY + row * (cardHeight + cardSpacing);

              const card = this.add.image(x, y, 'card').setOrigin(0, 0);
              card.setInteractive();
              card.isFlipped = false;
              card.textureKey = shuffledImages[i];

              card.on('pointerdown', () => {
                if (!card.isFlipped) {
                  this.flipCard(card, cards);
                }
              });

              cards.push(card);
            }

            // Voltear cartas pasados 2 segundos
            cards.forEach((card) => {
              revealCard(card);
            });

            this.time.delayedCall(2000, () => {
              cards.forEach((card) => {
                hideCard(card);
              });
            });

            // Comprobar coincidencias (Working progress)
            this.flipCard = (card, cards) => {
              revealCard(card);
              this.flippedCards.push(card);
              checkMatch();
            };
          },
        },
      };

      const game = new Phaser.Game(config);
    },
  },
});