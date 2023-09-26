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
  AbstractMesh
} from "@babylonjs/core";
import "@babylonjs/loaders";
import Ammo from "ammojs-typed";
// import * as CANNON from "cannon";

export class PhysicsForces {
  scene: Scene;
  engine: Engine;
  camera!: FreeCamera;
  cannonball!: Mesh;
  ground!: Mesh;
  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true);

    this.scene = this.CreateScene(canvas);
    this.CreatePhysics();
    this.CreateEnvironment();

    this.scene.onPointerDown = (e) => {
      if (e.button === 2) this.shootCannonball();
    }

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

    const camera = new FreeCamera("camera", new Vector3(0, 40, -40), scene);
    camera.rotation = new Vector3(Math.PI / 4, 0, 0); // 例如，将仰角设置为 60 度
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
    this.CreateImpulse();
    this.CreateCannonball();
  }

  // 建立地面碰撞
  CreateImpostors(): void {
    const ground = MeshBuilder.CreateGround(
      "ground",
      { width: 40, height: 40 },
    );
    ground.isVisible = false;
    ground.physicsImpostor = new PhysicsImpostor(
      ground,
      PhysicsImpostor.BoxImpostor,
      { mass: 0, restitution: 1 } // 归还
    )
    this.ground = ground;
  }


  CreateImpulse(): void {
    const box = MeshBuilder.CreateBox("box", { height: 4 });
    box.position.y = 3;
    const boxMat = new PBRMaterial("boxMat", this.scene);
    boxMat.roughness = 1;
    boxMat.albedoColor = new Color3(1, .5, 0);
    box.material = boxMat;
    box.physicsImpostor = new PhysicsImpostor(
      box,
      PhysicsImpostor.BoxImpostor,
      { mass: 0.5, friction: 1 }
    );

    box.actionManager = new ActionManager(this.scene);

    box.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnPickDownTrigger, () => {
        // 用于施加冲量到物体上，以模拟力的效果
        box.physicsImpostor!.applyImpulse(
          new Vector3(-3, 0, 0),
          // 获取物体的全局位置作为力的发力点
          box.getAbsolutePosition().add(new Vector3(0, 2, 0))
        )
      })
    )

  }
  // applyImpulse 会在物体上施加一个瞬时的力，之后物体根据物理引擎的规则持续运动

  // applyForce 则会在物体上施加一个持续的力，物体会根据力的方向和大小持续加速或减速



  // getRandomColor() {
  //   const r = Math.random();
  //   const g = Math.random();
  //   const b = Math.random();
  //   return new Color3(r, g, b);
  // }
  CreateCannonball(): void {
    this.cannonball = MeshBuilder.CreateSphere("cannonball", { diameter: 0.5 });
    const ballMat = new PBRMaterial("ballMat", this.scene);
    ballMat.roughness = 1;
    ballMat.albedoColor = new Color3(0, 1, 0);
    // ballMat.albedoColor = this.getRandomColor();
    this.cannonball.material = ballMat;
    this.cannonball.physicsImpostor = new PhysicsImpostor(
      this.cannonball,
      PhysicsImpostor.SphereImpostor,
      { mass: 1, friction: 1 }
    )
    this.cannonball.position = this.camera.position;
    this.cannonball.setEnabled(false)
  }

  //建立一个cannonball的克隆，可以灵活操控小球的属性
  shootCannonball(): void {
    const clone = this.cannonball.clone("clone");
    clone.position = this.camera.position;
    clone.setEnabled(true);
    // applyForce 方法用于在物理仿真中应用一个力到物体上
    clone.physicsImpostor!.applyForce(
      this.camera.getForwardRay().direction.scale(1000),
      clone.getAbsolutePosition()
    )
    // 碰撞器
    clone.physicsImpostor?.registerOnPhysicsCollide(this.ground.physicsImpostor!, () => {
      setTimeout(() => {
        clone.dispose();
      }, 3000)
    })
  }
}
