// 力的作用，冲力
import {
  Mesh,
  Scene,
  Engine,
  SceneLoader,
  HemisphericLight,
  CubeTexture,
  FreeCamera,
  Vector3,
  CannonJSPlugin,
  MeshBuilder,
  PhysicsImpostor,
  AmmoJSPlugin,
  PBRMaterial,
  Color3,
  ActionManager,
  ExecuteCodeAction,
  AbstractMesh,
  Texture,
  Matrix
} from "@babylonjs/core";
import "@babylonjs/loaders";
import Ammo from "ammojs-typed";
// import * as CANNON from "cannon";

export class Raycasting {
  scene: Scene;
  engine: Engine;
  camera!: FreeCamera;
  splatters!: PBRMaterial[];

  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true);

    this.scene = this.CreateScene(canvas);

    this.CreateEnvironment();
    this.CreateTextures();
    this.CreatePickingRay();
    this.CreatePhysics();
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
    this.camera = camera;
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


  async CreatePhysics(): Promise<void> {
    const ammo = await Ammo();
    const physics = new AmmoJSPlugin(true, ammo);
    this.scene.enablePhysics(new Vector3(0, -9.81, 0), physics);

    this.CreateImpostors();
  }

  CreateImpostors(): void {
    const ground = MeshBuilder.CreateGround(
      "ground",
      { width: 40, height: 40 },
    );
    ground.isVisible = false;
    ground.physicsImpostor = new PhysicsImpostor(
      ground,
      PhysicsImpostor.BoxImpostor,
      { mass: 0, restitution: 1, friction: 10 } // 归还
    )
    const sphere = MeshBuilder.CreateSphere("sphere", { diameter: 3 });
    const sphMat = new PBRMaterial("sphMat", this.scene);
    sphMat.roughness = 1;
    sphere.position.y = 3;
    sphMat.albedoColor = new Color3(1, .5, 0);
    sphere.material = sphMat;
    sphere.physicsImpostor = new PhysicsImpostor(
      sphere,
      PhysicsImpostor.SphereImpostor,
      { mass: 20, friction: 1 }
    );
  }

  CreateTextures(): void {
    const blue = new PBRMaterial("blue", this.scene);
    const orange = new PBRMaterial("orange", this.scene);
    const green = new PBRMaterial("green", this.scene);
    blue.roughness = 1;
    orange.roughness = 1;
    green.roughness = 1;
    blue.albedoTexture = new Texture("./textures/blue.png", this.scene);
    orange.albedoTexture = new Texture("./textures/orange.png", this.scene);
    green.albedoTexture = new Texture("./textures/green.png", this.scene);
    blue.albedoTexture.hasAlpha = true;
    orange.albedoTexture.hasAlpha = true;
    green.albedoTexture.hasAlpha = true;
    blue.zOffset = -0.25;
    orange.zOffset = -0.25;
    green.zOffset = -0.25;
    this.splatters = [blue, orange, green];
  }

  CreatePickingRay(): void {
    this.scene.onPointerDown = () => {


      const ray = this.scene.createPickingRay(  //创建一个拾取射线。
        this.scene.pointerX,
        this.scene.pointerY,
        Matrix.Identity(),  //这个矩阵参数是一个可选参数，通常用于指定一个变换矩阵,局部坐标系转换到世界坐标系
        this.camera // 确定射线的起点和方向。射线从相机位置开始，并且其方向与相机的视线方向相匹配。
      )
      const raycastHit = this.scene.pickWithRay(ray);
      if (raycastHit?.hit && raycastHit.pickedMesh?.name === "sphere") {
        // console.log(raycastHit);
        // 创建一个贴花（decal）
        const decal = MeshBuilder.CreateDecal(
          "decal",
          // 附加到 点击的Mesh 上
          raycastHit.pickedMesh,
          {
            // 位置是 raycastHit.pickedPoint
            position: raycastHit.pickedPoint!,
            normal: raycastHit.getNormal(true)!,
            // 大小是 (1, 1, 1)
            size: new Vector3(1, 1, 1)
          }
        );
        decal.material = this.splatters[Math.floor(Math.random() * this.splatters.length)]
        // applyImpulse 会在物体上施加一个瞬时的力
        decal.setParent(raycastHit.pickedMesh);
        raycastHit.pickedMesh.physicsImpostor?.applyImpulse(
          ray.direction.scale(5),
          raycastHit.pickedPoint!
        )
      } else {
        // console.log(raycastHit);
      }
    }
  }
}
