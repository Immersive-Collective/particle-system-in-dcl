import { AudioSource, AvatarAttach, Entity, MeshCollider,engine, Transform, MeshRenderer, AvatarAnchorPointType } from '@dcl/sdk/ecs'


/*
export function createSound(src: string) {
  const entity = engine.addEntity()
  Transform.create(entity)
  AudioSource.create(entity, { audioClipUrl: src, playing: true })
  return entity
}
*/


export function playSound(entity: Entity){
  const audioSource = AudioSource.getMutable(entity);
  if (audioSource) {
    audioSource.playing = true;
    audioSource.loop = true;
    console.log("Audio should be playing");
  } else {
    console.log("Audio source is undefined");
  }
}

export function stopSound(entity: Entity){
  const audioSource = AudioSource.getMutable(entity);
  if (audioSource) {
    audioSource.playing = false;
    audioSource.loop = false;
    console.log("Audio should be playing");
  } else {
    console.log("Audio source is undefined");
  }
}

export function playOneShot(entity: Entity){
  const audioSource = AudioSource.getMutable(entity);
  if (audioSource) {
    audioSource.playing = true;
    audioSource.loop = false;
    console.log("Audio should be playing");
  } else {
    console.log("Audio source is undefined");
  }
}


export const intro = engine.addEntity()
//MeshCollider.setBox(intro)
MeshCollider.setBox(intro)
AudioSource.create(intro, {
  audioClipUrl: 'sounds/lobbyOFFair.mp3',
  playing: true
})
Transform.create(intro, {
  position: { x: 8, y: 6, z:-9 },
  scale: { x: 1, y: 1, z: 1 },
});    



export const PartAudio = engine.addEntity()
//MeshRenderer.setBox(PartAudio)
MeshCollider.setBox(PartAudio)

AudioSource.create(PartAudio, {
  audioClipUrl: 'sounds/ambient1!.mp3',
  playing: true
})
Transform.create(PartAudio, {
  position: { x: 7.8, y: 4, z: 1.68 },
  scale: { x: 1, y: 1, z: 1 },

});    

export const flower = engine.addEntity()
//MeshCollider.setBox(flower)
//MeshRenderer.setBox(flower)
AudioSource.create(flower, {
  audioClipUrl: 'sounds/flower.mp3',
  playing: true
})
AvatarAttach.createOrReplace(flower, {
  anchorPointId: AvatarAnchorPointType.AAPT_NAME_TAG
})

export const PowerDown = engine.addEntity()
MeshCollider.setBox(PowerDown)

AudioSource.create(PowerDown, {
  audioClipUrl: 'sounds/powerDown!.mp3',
  playing: true
})
Transform.create(PowerDown, {
  position: { x: 7.8, y: 8, z: 1.68 },
  scale: { x: 1, y: 1, z: 1 },

});    
