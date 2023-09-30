// 力的作用，冲力
import {
  Scene,
  Engine,
  SceneLoader,
  CubeTexture,
  FreeCamera,
  Vector3,
  Animation,
  AnimationGroup
} from "@babylonjs/core";
import "@babylonjs/loaders";
// import * as CANNON from "cannon";

export class Cutscene {
  scene: Scene;
  engine: Engine;
  characterAnimations!: AnimationGroup[];
  camera!: FreeCamera;
  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true);

    this.scene = this.CreateScene(canvas);

    this.CreateEnvironment();
    this.CreateCharacter();
    this.CreateZombies();
    this.CreateCutscene()
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

    this.camera = new FreeCamera("camera", new Vector3(8, 2, -10), scene);
    // camera.rotation = new Vector3(Math.PI / 4, 0, 0); // 例如，将仰角设置为 60 度
    // this.camera.attachControl(canvas, true);
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
      "character_new.glb",
      this.scene
    );
    // console.log("meshes", meshes);
    // console.log("animationGroups", animationGroups);


    meshes[0].rotate(Vector3.Up(), -Math.PI / 2);
    meshes[0].position = new Vector3(8, 0, -4);
    this.characterAnimations = animationGroups;
    this.characterAnimations[0].stop();
    this.characterAnimations[1].play();
    // this.characterAnimations[2].play(true);


  }

  async CreateZombies(): Promise<void> {
    const zombieOne = await SceneLoader.ImportMeshAsync(
      "",
      "./models/",
      "zombie_1.glb",
    );
    const zombieTwo = await SceneLoader.ImportMeshAsync(
      "",
      "./models/",
      "zombie_2.glb",
    );

    zombieOne.meshes[0].rotate(Vector3.Up(), Math.PI / 2);
    zombieOne.meshes[0].position = new Vector3(-8, 0, -4);
    zombieTwo.meshes[0].rotate(Vector3.Up(), Math.PI / 2);
    zombieTwo.meshes[0].position = new Vector3(-6, 0, -2);



  }

  async CreateCutscene(): Promise<void> {
    const camKeys = [];
    const fps = 60;

    const camAnim = new Animation(
      "camAnim",
      "position",
      fps,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CONSTANT,
      true
    );

    camKeys.push({ frame: 0, value: new Vector3(5, 4, -8) });
    camKeys.push({ frame: 1, value: new Vector3(8, 2, -8) });
    camKeys.push({ frame: 5 * fps, value: new Vector3(-6, 2, -8) });
    camKeys.push({ frame: 8 * fps, value: new Vector3(-6, 2, -8) });
    camKeys.push({ frame: 12 * fps, value: new Vector3(0, 3, -16) });

    camAnim.setKeys(camKeys);

    this.camera.animations.push(camAnim);

    const a = await this.scene.beginAnimation(
      this.camera,
      0,
      12 * fps,
    ).waitAsync();
    this.EndCutscene();
  }

  EndCutscene(): void {
    this.camera.attachControl();

    this.characterAnimations[1].stop();
    this.characterAnimations[0].play();
  }

}
