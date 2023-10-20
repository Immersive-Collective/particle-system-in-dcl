import { createPowerBase } from './powerBase'
import { createPowerCube } from './powerCube'
//import { onEnterSceneObservable, onLeaveSceneObservable } from '@dcl/sdk/observables'
import { circularSystem } from './systems'
import * as utils from "@dcl-sdk/utils"
import { Color3, Color4, Vector3, Quaternion } from '@dcl/sdk/math'
//import { SceneSound,SceneSound1,SceneSound2,playOneshot,playSound } from './sound'
engine.addSystem(circularSystem)
//import { playSound, intro,PartAudio } from './sound'

import {
  AudioSource,
  AvatarAnchorPointType,
  AvatarAttach,
  engine,
  GltfContainer,
  InputAction,
  inputSystem,
  PointerEvents,
  PointerEventType,
  Transform, MeshCollider
} from '@dcl/sdk/ecs'
//import { Vector3, Quaternion } from '@dcl/sdk/math'
import { playSound,intro } from './sound'

export function main() {

  playSound(intro)

  // Base
  const staticBase = engine.addEntity()
  //GltfContainer.create(staticBase, { src: 'models/staticBase.glb' })
  PointerEvents.create(staticBase, {
    pointerEvents: [
      {
        eventType: PointerEventType.PET_DOWN,
        eventInfo: {
          showFeedback: false
        }
      }

    ]
  })

  // Scene objects
 

  const GROUND_HEIGHT = 0.55

  createPowerBase(Vector3.create(8, 0.024, 3.5), 'base')
  const powerCubeEntity = createPowerCube(Vector3.create(8.56, GROUND_HEIGHT, -14.02), 'models/PlantAqua.glb')
  MeshCollider.setBox(powerCubeEntity)
  

const tile1 = engine.addEntity()
GltfContainer.create(tile1, { src: 'models/CityTile.glb'}) 
//Spinner.create(tile1, { speed: 100 })
Transform.create(tile1, {
position: Vector3.create(8, 0, 8),
scale: Vector3.create(1, 1, 1), 
rotation: Quaternion.fromEulerDegrees(0, 180, 0),
})

const tile2 = engine.addEntity()
GltfContainer.create(tile2, { src: 'models/CityTile.glb'}) 
//Spinner.create(tile1, { speed: 100 })
Transform.create(tile2, {
position: Vector3.create(8, 0, -8),
scale: Vector3.create(1, 1, 1), 
rotation: Quaternion.fromEulerDegrees(0, 180, 0),
})


}
