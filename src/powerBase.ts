import {
  AudioSource,
  engine,
  GltfContainer,
  PointerEvents,
  PointerEventType,
  Transform,
  VisibilityComponent
} from '@dcl/sdk/ecs'
import { Vector3, Quaternion } from '@dcl/sdk/math'
import { Particle, particleSystem } from './particles'
import { playOneShot,PowerDown, stopSound,PartAudio,playSound } from './sound'
import * as utils from '@dcl-sdk/utils'

import { Spinner } from './components'
//import { circularSystem } from './systems'


stopSound(PartAudio)
stopSound(PowerDown)

// Power glows
/*
const powerBlueGlowEntity = engine.addEntity()
GltfContainer.create(powerBlueGlowEntity, { src: 'models/punkhead1.glb' })
Spinner.create(powerBlueGlowEntity, { speed: 100 })
Transform.create(powerBlueGlowEntity, {
position: Vector3.create(8.12, 2, 3.71),
scale: Vector3.create(0.1, 0.1, 0.1), 
rotation: Quaternion.fromEulerDegrees(0, 180, 90),
})
*/

/*
const punkface = engine.addEntity()
GltfContainer.create(punkface, { src: 'models/punkhead.glb'}) 
Spinner.create(punkface, { speed: 100 })
Transform.create(punkface, {
position: Vector3.create(8.12, 2, 3.71),
scale: Vector3.create(0.1, 0.1, 0.1), 
rotation: Quaternion.fromEulerDegrees(0, 180, 90),
})
*/


const powerRedGlowEntity = engine.addEntity()
GltfContainer.create(powerRedGlowEntity, { src: 'models/punkhead.glb' })
Spinner.create(powerRedGlowEntity, { speed: 100 })
Transform.create(powerRedGlowEntity, {
position: Vector3.create(8.12, 2, 3.71),
scale: Vector3.create(0.1, 0.1, 0.1), 
rotation: Quaternion.fromEulerDegrees(0, 180, 90),
})

/*
// Forcefield
const forcefieldEntity = engine.addEntity()
GltfContainer.create(forcefieldEntity, { src: 'models/forcefield1.glb' })
Transform.create(forcefieldEntity)
*/

    //AudioSource.getMutable(cubePutDownSound).playing = true

// Sounds
//const powerUp = createSound('sounds/Ambient1.mp3')
//const powerDown = createSound('sounds/powerDown!.mp3')

export function createPowerBase(position: Vector3, BoxSource: string) {
  const entity = engine.addEntity()

  Transform.create(entity, { position })
  GltfContainer.create(entity, { src: BoxSource })
  PointerEvents.create(entity, {
    pointerEvents: [
      {
        eventType: PointerEventType.PET_DOWN,
        eventInfo: {
          showFeedback: false
        }
      }
    ]
  })

  function togglePower(isPowerOn: boolean) {
    if (isPowerOn) {
      // TODO: change this workaround until the DisableComponent is available
  //    Transform.getMutable(powerBlueGlowEntity).scale = Vector3.create(0.1, 0.1, 0.1)
      Transform.getMutable(powerRedGlowEntity).scale = Vector3.create(0, 0, 0)
   //   playOneShot(PowerDown)

   //   Transform.getMutable(forcefieldEntity).scale = Vector3.One()

      try {
        engine.addSystem(particleSystem)
      } catch (err) {}
       playSound(PartAudio)
      //AudioSource.getMutable(powerUp).playing = true

      for (const [entity] of engine.getEntitiesWith(Particle)) {
        VisibilityComponent.deleteFrom(entity)
      }
    } else {
      // NOTE: particles have colliders so need to move them elsewhere
      for (const [entity] of engine.getEntitiesWith(Particle)) {
        VisibilityComponent.createOrReplace(entity, { visible: false })
      }

      // TODO: change this workaround until the DisableComponent is available
      // Hide the blue glow
    //  Transform.getMutable(powerBlueGlowEntity).scale = Vector3.Zero()
   //   Transform.getMutable(forcefieldEntity).scale = Vector3.Zero()
      Transform.getMutable(powerRedGlowEntity).scale = Vector3.create(0.1, 0.1, 0.1)

      engine.removeSystem(particleSystem)
     playOneShot(PowerDown)
     stopSound(PartAudio)
      // AudioSource.getMutable(powerDown).playing = true
    }
  }

  utils.triggers.addTrigger(
    entity,
    2,
    2,
    [
      {
        type: 'box',
        scale: Vector3.create(4, 4, 4),
        position: Vector3.create(0, 0.75, 0)
      }
    ],
    (entity) => {
      console.log('on enter', { entity })
      //if (args.length > 0)
      togglePower(true)
    },
    (entity) => {
      console.log('on exit', { entity })
      //if (args.length === 0)
      togglePower(false)
    }
  )
}

// Power base where the power cube sits
