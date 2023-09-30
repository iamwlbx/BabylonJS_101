// 力的作用，冲力
import {
  Scene,
  Engine,
  SceneLoader,
  CubeTexture,
  FreeCamera,
  Vector3,
} from "@babylonjs/core";
import "@babylonjs/loaders";

// import * as CANNON from "cannon";

export class CharacterAnimations {
  scene: Scene;
  engine: Engine;
  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true);

    this.scene = this.CreateScene(canvas);

    this.CreateEnvironment();
    this.CreateCharacter();
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

    const camera = new FreeCamera("camera", new Vector3(0, 5, -15), scene);
    // camera.rotation = new Vector3(Math.PI / 4, 0, 0); // 例如，将仰角设置为 60 度
    camera.attachControl(canvas, true);
    camera.minZ = .5;
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
      "character.glb",
      this.scene
    );
    console.log("meshes", meshes);
    console.log("animationGroups", animationGroups);


    meshes[0].rotate(Vector3.Up(), Math.PI);
    animationGroups[0].stop();
    // animationGroups[1].play(true);
    animationGroups[2].play(true);




  }








}
