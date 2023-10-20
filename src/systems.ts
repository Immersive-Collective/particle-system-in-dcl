import {
  engine,
  Transform,Animator
} from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { Spinner } from './components'
//import  {GearState} from './components'
//import { DoorState } from './components'


/**
 * All cubes/ teleport flowers rotating behavior
 */
export function circularSystem(dt: number) {
  const entitiesWithSpinner = engine.getEntitiesWith(Spinner, Transform)
  for (const [entity, _spinner, _transform] of entitiesWithSpinner) {
    const mutableTransform = Transform.getMutable(entity)
    const spinnerData = Spinner.get(entity)

    mutableTransform.rotation = Quaternion.multiply(
      mutableTransform.rotation,
      Quaternion.fromAngleAxis(dt * spinnerData.speed, Vector3.Left())
    )
  }
}

// Gear system 

/*

export function gearSystem(dt: number) {
  const gearEntities = engine.getEntitiesWith(GearState, Animator)
  for (const [entity, _gearState] of gearEntities) {
    if (_gearState.Hide) {
      GearState.getMutable(entity).Hide = false
      const animator = Animator.getMutable(entity)

      if (_gearState.ON) {
        Animator.playSingleAnimation(entity, 'Open') // insert name of animation 
      } else {
        Animator.playSingleAnimation(entity, 'Close')
      }
    }
  }
}

*/


/**
 * Handle door states
 */



/// TOGGLE SWITCHES WITH UTILS /// 

/*

import * as utils from '@dcl/ecs-scene-utils'

// Create entity
const box = new Entity()

// Give entity a shape and transform
box.addComponent(new BoxShape())
box.addComponent(new Transform())

//Define two different materials
let greenMaterial = new Material()
greenMaterial.albedoColor = Color3.Green()
let redMaterial = new Material()
redMaterial.albedoColor = Color3.Red()

// Add a Toggle component
box.addComponent(
  new utils.ToggleComponent(utils.ToggleState.Off, value => {
    if (value == utils.ToggleState.On) {
      //set color to green
      box.addComponentOrReplace(greenMaterial)
    } else {
      //set color to red
      box.addComponentOrReplace(redMaterial)
    }
  })
)

//listen for click on the box and toggle it's state
box.addComponent(
  new OnClick(event => {
    box.getComponent(utils.ToggleComponent).toggle()
  })
)

// Add entity to engine
engine.addEntity(box)

*/