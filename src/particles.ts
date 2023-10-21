import { engine, Material, MeshRenderer, PBMaterial_PbrMaterial, Schemas, Transform } from '@dcl/sdk/ecs';
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math';

let timeElapsed = 0;

export const ParticleState = {
  ACTIVE: "ACTIVE",
  DROPPING: "DROPPING",
  INACTIVE: "INACTIVE"
};


const transitionProbabilities = [0.3, 0.2, 0.2, 0.1, 0.2];
const tightnessArray = [0.1, 0.3, 0.5, 0.8, 1];
const speedArray = [0.5, 1, 1.5, 2];
const spiralCountArray = [4, 6, 8];
const sizeArray = [0.1, 0.5, 1, 2, 5];

type ParticleStateType = keyof typeof ParticleState;


export const Particle = engine.defineComponent('Particle', {
  angle: Schemas.Float,
  radius: Schemas.Float,
  speed: Schemas.Number,
  spiralOffset: Schemas.Float,
  state: Schemas.String,
  markovStep: Schemas.Int // Current step in Markov Chain
});

export function particleSystem(dt: number) {
  timeElapsed += dt;

  for (const [entity] of engine.getEntitiesWith(Particle, Transform)) {
    const particle = Particle.getMutable(entity);
    particle.angle += dt * particle.speed;

    if (particle.angle >= 2 * Math.PI) {
      particle.angle = 0;

      // Determine next Markov step
      const randomNumber = Math.random();
      let sum = 0;
      for (let prob of transitionProbabilities) {
        sum += prob;
        if (randomNumber <= sum) {
          particle.markovStep = transitionProbabilities.indexOf(prob);
          break;
        }
      }

      // Apply new settings based on Markov step
      particle.speed = speedArray[particle.markovStep % speedArray.length];
    }

    const transform = Transform.getMutable(entity);
    const adjustedAngle = particle.angle * tightnessArray[particle.markovStep % tightnessArray.length];
    const x = particle.radius * Math.cos(adjustedAngle + particle.spiralOffset);
    const z = particle.radius * Math.sin(adjustedAngle + particle.spiralOffset);
    const y = particle.radius * Math.sin(adjustedAngle); // Added Y-coordinate to move downward
    transform.position = Vector3.create(x, y, z); // Added y to the position vector
    const adjustedSize = sizeArray[particle.markovStep % sizeArray.length];
    transform.scale = Vector3.create(adjustedSize, adjustedSize, adjustedSize);
    


  }
}

const material: PBMaterial_PbrMaterial = {
  metallic: 1,
  albedoColor: Color4.create(0.5, 1.5, 2),
  emissiveColor: Color4.create(0.2, 0.5, 2)
};

const particleParentEntity = engine.addEntity();
Transform.create(particleParentEntity, {
  position: Vector3.create(7.97, 10, 4.37),
  rotation: Quaternion.fromEulerDegrees(0, 90, 0)
});

const MAX_PARTICLES_PER_SPIRAL = 80;
const SPIRAL_COUNT = 10;
const SPIRAL_OFFSET = (2 * Math.PI) / SPIRAL_COUNT;

for (let s = 0; s < SPIRAL_COUNT; s++) {
  for (let i = 0; i < MAX_PARTICLES_PER_SPIRAL; i++) {
    const particleEntity = engine.addEntity();
    MeshRenderer.setBox(particleEntity); // Setting particles to be cubes
    Material.setPbrMaterial(particleEntity, material);
    
    Particle.create(particleEntity, {
      angle: i * 0.2,
      radius: i * 0.3,
      speed: 2,
      spiralOffset: s * SPIRAL_OFFSET,
      state: ParticleState.ACTIVE,
      markovStep: 0
    });

    Transform.create(particleEntity, {
      scale: Vector3.create(0.2, 5, 0.2), // Scale for the cube
      parent: particleParentEntity
    });
  }
}
