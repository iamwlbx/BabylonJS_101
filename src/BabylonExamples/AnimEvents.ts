// 获取animationGroups[]里的各个动画，并设置好 mesh1 的当前动画哪个stop或play
// 利用animationGroups[0].targetedAnimations[0].animation获取第一小组的动画
// 创建事件对象，设置第几帧开始执行回调
// 将事件对象添加到第一小组的动画中，代表着执行第一小组的 X 帧后就开始执行回调
// 回调中注意顺序，mesh2的动画顺序
// 触发animationGroups[]某一个动画  .play()

import {
  Scene,
  Engine,
  SceneLoader,
  CubeTexture,
  FreeCamera,
  Vector3,
  Animation,
  AnimationGroup,
  AnimationEvent
} from "@babylonjs/core";
import "@babylonjs/loaders";

// import * as CANNON from "cannon";

export class AnimEvents {
  scene: Scene;
  engine: Engine;
  characterAnimations!: AnimationGroup[];
  camera!: FreeCamera;
  zombieAnims!: AnimationGroup[];
  cheer!: AnimationGroup;
  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true);

    this.scene = this.CreateScene(canvas);

    this.CreateEnvironment();
    this.CreateCharacter();
    this.CreateZombies();
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  public resize(): void {
    // console.log("重绘中...");

    if (this.scene) {
      this.scene.getEngine().resize();
    }
  }

  CreateScene(canvas: HTMLElement): Scene {
    const scene = new Scene(this.engine);
    // new HemisphericLight("hemi", new Vector3(0, 1, 0), this.scene);
    const envTex = CubeTexture.CreateFromPrefilteredData(
      "./environment/sky.env",
      scene
    )
    // 用于非HDR（High Dynamic Range）纹理。
    envTex.gammaSpace = false;
    envTex.rotationY = Math.PI / 2;
    scene.environmentTexture = envTex;
    scene.createDefaultSkybox(envTex, true, 1000, .25);
    // scene.enablePhysics()

    this.camera = new FreeCamera("camera", new Vector3(0, 5, -15), scene);
    // camera.rotation = new Vector3(Math.PI / 4, 0, 0); // 例如，将仰角设置为 60 度
    this.camera.attachControl(canvas, true);
    this.camera.minZ = .5;
    this.camera.speed = .5;
    return scene;
  }

  async CreateEnvironment(): Promise<void> {
    const { meshes } = await SceneLoader.ImportMeshAsync(
      "",
      "./models/",
      "Prototype_Level_new.glb",
      this.scene
    );
  }

  async CreateCharacter(): Promise<void> {
    const { meshes, animationGroups } = await SceneLoader.ImportMeshAsync(
      "",
      "./models/",
      "character_attack.glb",
      this.scene
    );
    // console.log("meshes", meshes);
    console.log("animationGroups", animationGroups);


    meshes[0].rotate(Vector3.Up(), -Math.PI / 2);
    meshes[0].position = new Vector3(3, 0, 0);
    this.cheer = animationGroups[0];
    const idle = animationGroups[1];
    const attack = animationGroups[2];

    this.cheer.stop();
    idle.play(true);

    // attackAnim为attack动画的第一步
    const attackAnim = animationGroups[2].targetedAnimations[0].animation;


    // 新建attack事件对象，用于在动画的特定帧（第 10 帧）上触发某个操作
    const attackEvt = new AnimationEvent(
      100,
      // 执行以下操作
      () => {
        this.zombieAnims[1].stop();
        this.zombieAnims[0].play();
      },
      false
    );

    // attack 是一个动画组，调用 attack.play() 时会触发该动画组中的所有动画开始播放，包括了 attackAnim

    // 将事件对象绑定到attackAnim上
    attackAnim.addEvent(attackEvt);
    this.scene.onPointerDown = evt => {
      if (evt.button === 2) {
        this.zombieAnims[0].stop();
        this.zombieAnims[1].play()
        attack.play();
      }
    }

    // this.characterAnimations[2].play(true);


  }

  async CreateZombies(): Promise<void> {
    const { meshes, animationGroups } = await SceneLoader.ImportMeshAsync(
      "",
      "./models/",
      "zombie_death.glb",
    );
    this.zombieAnims = animationGroups;

    meshes[0].rotate(Vector3.Up(), Math.PI / 2);
    meshes[0].position = new Vector3(-3, 0, 0);

    this.zombieAnims[0].stop();
    this.zombieAnims[1].play(true);


    const deathAnim = this.zombieAnims[0].targetedAnimations[0].animation;
    const deathEvt = new AnimationEvent(
      150,
      // 执行以下操作
      () => {
        this.cheer.play(true);
      },
      false
    );
    deathAnim.addEvent(deathEvt);
  }


}
