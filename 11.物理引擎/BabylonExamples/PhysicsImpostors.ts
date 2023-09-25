// 重力和碰撞
import {
  Scene,
  Engine,
  SceneLoader,
  FreeCamera,
  Vector3,
  HemisphericLight,
  CannonJSPlugin,
  MeshBuilder,
  PhysicsImpostor
} from "@babylonjs/core";
import "@babylonjs/loaders";
import * as CANNON from "cannon"  // js封装的物理引擎



export class PhysicsImpostors {
  scene: Scene;
  engine: Engine;

  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true);
    this.scene = this.CreateScene();

    this.CreateEnvironment();
    // this.CreateController();

    this.CreateImpostors();

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
  CreateScene(): Scene {
    const scene = new Scene(this.engine);
    new HemisphericLight("hemi", new Vector3(0, 1, 0), this.scene)

    scene.onPointerDown = (evt) => {
      // 进入指针锁
      if (evt.button === 0) this.engine.enterPointerlock();
      if (evt.button === 2) this.engine.exitPointerlock();
    }
    // const framesPersecond = 60; //帧率
    // const gravity = -9.81;      //重力
    // //物理引擎  模拟物体受到重力影响时的行为，使它以每秒9.81米/秒²的速度向下加速。
    // scene.gravity = new Vector3(0, gravity / framesPersecond, 0);
    // scene.collisionsEnabled = true; // 添加碰撞/可以碰撞
    const camera = new FreeCamera("camera", new Vector3(0, 10, -20), this.scene)
    camera.setTarget(Vector3.Zero())
    camera.attachControl()
    // 相机与场景中物体之间的最小距离,超出的渲染会被裁剪.
    camera.minZ = 0.5;
    scene.enablePhysics(new Vector3(0, -9.81, 0), new CannonJSPlugin(true, 10, CANNON))
    camera.keysUp.push(87);
    camera.keysLeft.push(65);
    camera.keysDown.push(83);
    camera.keysRight.push(68);
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
  CreateImpostors(): void {
    // 实现物理模拟的重要组件
    // 物理模拟的包装器，可以附加到 Mesh 对象上。通过附加 PhysicsImpostor，
    // 可以使物体具有物理属性，使其可以受到引力、碰撞、力和其他物理效应的影响
    const box = MeshBuilder.CreateBox("box", { size: 2 });
    box.position = new Vector3(0, 6, 1);
    box.rotation = new Vector3(Math.PI / 4, 0, 0)
    box.physicsImpostor = new PhysicsImpostor(
      box,
      PhysicsImpostor.BoxImpostor,
      { mass: 1, restitution: 0.75 } // 回推力
    );

    const ground = MeshBuilder.CreateGround("ground", { width: 40, height: 40 });
    ground.isVisible = false;
    ground.physicsImpostor = new PhysicsImpostor(
      ground,
      PhysicsImpostor.BoxImpostor,
      { mass: 0, restitution: 0.5 } //推回力
    );

    const sphere = MeshBuilder.CreateSphere("sphere", { diameter: 3 });
    sphere.position = new Vector3(0, 10, 0);
    sphere.physicsImpostor = new PhysicsImpostor(
      sphere,
      PhysicsImpostor.SphereImpostor,
      { mass: 1, restitution: 0.8 }
    );
    const wall1 = MeshBuilder.CreateBox("wall1", { width: 40, height: 6, depth: 0.1 });
    wall1.position = new Vector3(0, 3, 19);
    const wall2 = MeshBuilder.CreateBox("wall2", { width: 40, height: 5, depth: 0.1 });
    wall2.position = new Vector3(0, 3, -19);
    const wall3 = MeshBuilder.CreateBox("wall3", { width: 0.1, height: 5, depth: 40 });
    wall3.position = new Vector3(19, 3, 0);
    const wall4 = MeshBuilder.CreateBox("wall4", { width: 0.1, height: 5, depth: 40 });
    wall4.position = new Vector3(-19, 3, 0);
    const wall = [wall1, wall2, wall3, wall4]
    // 设置物理仿真属性
    wall.forEach((item) => {
      item.physicsImpostor = new PhysicsImpostor(
        item,
        PhysicsImpostor.BoxImpostor,
        { mass: 0, restitution: 0.9 }
      );
      item.isVisible = false;
    })
    // wall1.physicsImpostor = new PhysicsImpostor(wall1, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 });
    // wall2.physicsImpostor = new PhysicsImpostor(wall2, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 });
    // wall3.physicsImpostor = new PhysicsImpostor(wall3, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 });
    // wall4.physicsImpostor = new PhysicsImpostor(wall4, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 });
  }
}
