import { engine, Material, MeshRenderer, PBMaterial_PbrMaterial, Schemas, Transform } from '@dcl/sdk/ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { playSound,PartAudio } from './sound';


let timeElapsed = 0; // A global timer to track elapsed time.

export const ParticleState = {
  ACTIVE: "S0",
  DROPPING: "S1",
  INACTIVE: "S2"
};

export const Droplet = engine.defineComponent('Droplet', {
  lifetime: Schemas.Float // time after which the droplet will be destroyed
});


export const Particle = engine.defineComponent('Particle', {
  angle: Schemas.Float,
  radius: Schemas.Float,
  width: Schemas.Number,
  height: Schemas.Number,
  speed: Schemas.Number,
  spiralOffset: Schemas.Float,
  state: Schemas.String

})

export function particleSystem(dt: number) {
  timeElapsed += dt; // Increase the global timer by the frame's time delta.

  for (const [entity] of engine.getEntitiesWith(Particle, Transform)) {
    const particle = Particle.getMutable(entity);

    particle.angle += dt * particle.speed;

    // Check if particle has completed a full rotation
    if (particle.angle >= 2 * Math.PI) {
      particle.angle = 0; // Reset the angle
    //  playSound(PartAudio)

      // Change state here, e.g., move to the next state in the sequence
      if (particle.state === ParticleState.ACTIVE) {
        particle.state = ParticleState.DROPPING;
      } else if (particle.state === ParticleState.DROPPING) {
        particle.state = ParticleState.INACTIVE;
      } else {
        particle.state = ParticleState.ACTIVE; // Loop back to ACTIVE if you wish
      }
    }

    // Particle behavior based on state
    switch (particle.state) {
      case ParticleState.DROPPING:
        const transform = Transform.getMutable(entity);
        transform.position.y -= 0.1; // Modify this to control drop speed
     //   playSound(PartAudio)
        break;
      case ParticleState.INACTIVE:
        // Perhaps make it invisible or remove other interactions
        break;
    }
  }

  // Handle Droplet Behavior
  for (const [entity] of engine.getEntitiesWith(Droplet, Transform)) {
  const droplet = Droplet.getMutable(entity);
  const transform = Transform.getMutable(entity);

  // Move droplet downwards
  transform.position.y -= 0.15; // Modify this for droplet's drop speed

  // Reduce the droplet's lifetime
  droplet.lifetime -= dt;

  // Destroy the droplet if it reaches the ground or after its lifetime expires
  if (transform.position.y <= 0 || droplet.lifetime <= 0) {
    engine.removeEntity(entity);
  }
}


  // Calculate tightness based on time.
  const tightnessAmplitude = 0.1; // Difference between max and min tightness
  const tightnessBase = 0.01; // Base value
  const tightness = tightnessBase + tightnessAmplitude * Math.sin(Math.PI * timeElapsed / 10); // 2 sec loop

  for (const [entity] of engine.getEntitiesWith(Particle, Transform)) {
    const particle = Particle.getMutable(entity)
    particle.angle += dt * particle.speed 

    // Adjust angle based on new tightness value.
    const adjustedAngle = particle.angle * tightness;
    const x = particle.radius * Math.cos(adjustedAngle + particle.spiralOffset)
    const z = particle.radius * Math.sin(adjustedAngle + particle.spiralOffset)

    const transform = Transform.getMutable(entity)
    transform.position = Vector3.create(x, 0, z)
  }
}

/*
albedoColor: Color4.create(0.5, 1.5, 2),
emissiveColor: Color4.create(0.5, 1.5, 2)
*/

const material: PBMaterial_PbrMaterial = {
  metallic: 1,
  albedoColor: Color4.create(0.5,1.5, 2),
  emissiveColor: Color4.create(0.2, 0.5, 2)
}

const particleParentEntity = engine.addEntity()
Transform.create(particleParentEntity, {
  position: Vector3.create(7.97,10, 4.37),
  rotation: Quaternion.fromEulerDegrees(0, 90, 0)
})

const MAX_PARTICLES_PER_SPIRAL = 60
const SPIRAL_TIGHTNESS = 0.1
const SPIRAL_COUNT = 8
const SPIRAL_OFFSET = (2 * Math.PI) / SPIRAL_COUNT // This creates the offset between spirals

for (let s = 0; s < SPIRAL_COUNT; s++) {
  for (let i = 0; i < MAX_PARTICLES_PER_SPIRAL; i++) {
    const particleEntity = engine.addEntity()
    MeshRenderer.setPlane(particleEntity)
    Material.setPbrMaterial(particleEntity, material)

    const angle = i * SPIRAL_TIGHTNESS
    const radius = i * 0.1

    Particle.create(particleEntity, {
      angle: angle,
      radius: radius,
      height: 10,
      speed: 0.25,
      spiralOffset: s * SPIRAL_OFFSET
    })

    Transform.create(particleEntity, {
      rotation: Quaternion.fromEulerDegrees(0, 90, 0),
      scale: Vector3.create(0.01, 15, 5),
      parent: particleParentEntity
    })
  }
}


// Check Particle State to Spawn Droplets
for (const [entity] of engine.getEntitiesWith(Particle, Transform)) {
  const particle = Particle.getMutable(entity);

  // Spawn droplet when the particle is in DROPPING state
  if (particle.state === ParticleState.DROPPING) {
    const dropletEntity = engine.addEntity();
    MeshRenderer.setPlane(dropletEntity);
    Material.setPbrMaterial(dropletEntity, material); // Assuming droplets have the same material as particles

    const particleTransform = Transform.get(entity);
    Transform.create(dropletEntity, {
      position: Vector3.create(
        particleTransform.position.x,
        particleTransform.position.y,
        particleTransform.position.z
      ),
      scale: Vector3.create(0.005, 0.005, 0.005)  // Adjust size for droplets
    });

    Droplet.create(dropletEntity, {
      lifetime: 3 // Adjust droplet's lifetime as needed (in seconds)
    });
  }
  const dropletMaterial: PBMaterial_PbrMaterial = {
    metallic: 0,
    albedoColor: Color4.create(0, 0.5, 1, 0.7), // Semi-transparent blue
    emissiveColor: Color4.create(0, 0, 0)
  };

}



