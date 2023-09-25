import {
  Scene,
  Engine,
  FreeCamera,
  Vector3,
  MeshBuilder,
  CubeTexture,
  Texture,
  PBRMaterial,
  SceneLoader,
} from "@babylonjs/core";
import "@babylonjs/loaders";

export class CustomModels {
  scene: Scene;
  engine: Engine;

  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true);
    this.scene = this.CreateScene();
    // this.CreateGround();
    // this.CreateBarrel();
    // this.CreateCampfire();
    this.CreateCampfire();
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  CreateScene(): Scene {
    const scene = new Scene(this.engine);
    const camera = new FreeCamera(
      "camera",
      new Vector3(0, 0.75, -8),
      this.scene
    );
    camera.attachControl();
    camera.speed = 0.25;

    const envTex = CubeTexture.CreateFromPrefilteredData(
      "./environment/sky.env",
      scene
    );

    scene.environmentTexture = envTex;

    scene.createDefaultSkybox(envTex, true);

    scene.environmentIntensity = 1;

    return scene;
  }

  CreateGround(): void {
    const ground = MeshBuilder.CreateGround(
      "ground",
      { width: 10, height: 10 },
      this.scene
    );

    ground.material = this.CreateAsphalt();
  }

  CreateAsphalt(): PBRMaterial {
    const pbr = new PBRMaterial("pbr", this.scene);
    pbr.albedoTexture = new Texture(
      "./textures/asphalt/asphalt_diffuse.jpg",
      this.scene
    );

    pbr.bumpTexture = new Texture(
      "./textures/asphalt/asphalt_normal.jpg",
      this.scene
    );

    pbr.invertNormalMapX = true;
    pbr.invertNormalMapY = true;

    pbr.useAmbientOcclusionFromMetallicTextureRed = true;
    pbr.useRoughnessFromMetallicTextureGreen = true;
    pbr.useMetallnessFromMetallicTextureBlue = true;

    pbr.metallicTexture = new Texture(
      "./textures/asphalt/asphalt_ao_rough_metal.jpg",
      this.scene
    );

    return pbr;
  }

  // 异步函数的返回值类型应该是 Promise。使用 Promise 可以更清晰地表达函数的异步性质，知道它返回一个异步结果。
  async CreateBarrel(): Promise<void> {

    // SceneLoader.ImportMesh(
    //   "", //所有的models
    //   "./models/",
    //   "barrel.glb",
    //   this.scene,
    //   (meshes) => { //[ 所有的mesh ]
    //     console.log('meshes', meshes);
    //   }
    // )
    const { meshes } = await SceneLoader.ImportMeshAsync(
      "",
      "./models/",
      "barrel.glb"
    )
    console.log("models", meshes);

  }

  async CreateCampfire(): Promise<void> {
    const models = await SceneLoader.ImportMeshAsync(
      "",
      "./models/",
      "campfire.glb"
    )
    models.meshes[0].position = new Vector3(1, -5, 0);
    models.meshes[1].position.y = -10
    console.log("models", models);
  }
}