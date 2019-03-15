declare function postMessage(
  message: any,
  targetOrigin?: string,
  transfer?: Transferable[],
): void;

export default () => {
  let particles = 6000;
  let positions: number[] = [];
  let colors: number[] = [];
  let sizes: number[] = [];
  let zMin = -2;
  let zMax = 0;

  function rand(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  // eslint-disable-next-line no-restricted-globals
  self.addEventListener("message", function(event) {
    if (event.data.type === "generate") {
      for (let i = 0; i < particles; i++) {
        positions.push(rand(-1, 1));
        positions.push(rand(-1, 1));
        positions.push(rand(zMin, zMax));
        sizes.push(32);

        let spectralColor = event.data.starSpectralColors[i % 512];

        colors.push(spectralColor[0]);
        colors.push(spectralColor[1]);
        colors.push(spectralColor[2]);
      }
    } else if (event.data.type === "move") {
    }

    postMessage({
      positions,
      colors,
      sizes,
    });
  });
};
