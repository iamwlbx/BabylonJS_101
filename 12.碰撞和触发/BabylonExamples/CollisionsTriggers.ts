// 碰撞和触发
// 绑定碰撞,碰撞后,可以判断主元素和碰撞元素。
// 碰撞后可以解除注册碰撞。
// 触发分为mesh相交和射线相交。相交返回true，以此做判断
import {
  Scene,
  Engine,
  SceneLoader,
  FreeCamera,
  Vector3,
  HemisphericLight,
  CannonJSPlugin,
  MeshBuilder,
  PhysicsImpostor,
  AbstractMesh,
  StandardMaterial,
  Color3
} from "@babylonjs/core";
import "@babylonjs/loaders";
import * as CANNON from "cannon"  // js封装的物理引擎



export class CollisionsTriggers {
  scene: Scene;
  engine: Engine;
  sphere!: AbstractMesh;
  box!: AbstractMesh;
  ground!: AbstractMesh;

  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true);
    this.scene = this.CreateScene();

    this.CreateEnvironment();
    // this.CreateController();

    this.CreateImpostors();
    this.DetectTrigger();
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
    // this.box = MeshBuilder.CreateBox("box", { size: 2 });
    // this.box.position = new Vector3(0, 3, 0);

    // this.box.physicsImpostor = new PhysicsImpostor(
    //   this.box,
    //   PhysicsImpostor.BoxImpostor,
    //   { mass: 1, restitution: 1 } // 回推力
    // );

    this.ground = MeshBuilder.CreateGround("ground", { width: 40, height: 40 });
    this.ground.position.y = 0.25;
    this.ground.isVisible = false;
    this.ground.physicsImpostor = new PhysicsImpostor(
      this.ground,
      PhysicsImpostor.BoxImpostor,
      { mass: 0, restitution: 1 } //推回力
    );

    this.sphere = MeshBuilder.CreateSphere("sphere", { diameter: 3 });
    this.sphere.position = new Vector3(0, 10, 0);
    this.sphere.physicsImpostor = new PhysicsImpostor(
      this.sphere,
      PhysicsImpostor.SphereImpostor,
      { mass: 1, restitution: 1, friction: 1 }
    );

    // this.sphere.physicsImpostor.registerOnPhysicsCollide(
    //   this.box.physicsImpostor,
    //   this.DetectCollisions
    // );
    // // 碰撞之后取消注册该事件
    // this.sphere.physicsImpostor.unregisterOnPhysicsCollide(
    //   this.ground.physicsImpostor,
    //   this.DetectCollisions
    // )

    // this.box.physicsImpostor.registerOnPhysicsCollide(this.sphere.physicsImpostor, this.DetectCollisions);

    // 设置墙体
    // const wall1 = MeshBuilder.CreateBox("wall1", { width: 40, height: 6, depth: 0.1 });
    // wall1.position = new Vector3(0, 3, 19);
    // const wall2 = MeshBuilder.CreateBox("wall2", { width: 40, height: 5, depth: 0.1 });
    // wall2.position = new Vector3(0, 3, -19);
    // const wall3 = MeshBuilder.CreateBox("wall3", { width: 0.1, height: 5, depth: 40 });
    // wall3.position = new Vector3(19, 3, 0);
    // const wall4 = MeshBuilder.CreateBox("wall4", { width: 0.1, height: 5, depth: 40 });
    // wall4.position = new Vector3(-19, 3, 0);
    // const wall = [wall1, wall2, wall3, wall4]
    // // 设置物理仿真属性
    // wall.forEach((item) => {
    //   item.physicsImpostor = new PhysicsImpostor(
    //     item,
    //     PhysicsImpostor.BoxImpostor,
    //     { mass: 0, restitution: 0.9 }
    //   );
    //   item.isVisible = false;
    // })


  }
  // boxCol.object 是指 PhysicsImpostor 所附加到的物理对象的网格（Mesh）实例。
  // this.box.physicsImpostor 是将物理仿真附加到 this.box 网格上的部分
  DetectCollisions(boxCol: PhysicsImpostor, colAgainst: any): void {

    const redMat = new StandardMaterial("rmat", this.scene);
    const greenMat = new StandardMaterial("gmat", this.scene);
    redMat.diffuseColor = new Color3(1, 0, 0);
    greenMat.diffuseColor = new Color3(0, 1, 0);
    // boxCol.object.scaling = new Vector3(3, 3, 3);
    // // 调用 setScalingUpdated 方法来告知物理引擎进行必要的处理，以确保物体的碰撞积体得到正确的更新。
    // boxCol.setScalingUpdated();
    // 将其作为抽象网格使用, 获得material的属性

    if ((colAgainst.object as AbstractMesh).id === "box") {
      (colAgainst.object as AbstractMesh).material = redMat;
    } else if ((colAgainst.object as AbstractMesh).name === "ground") {
      (colAgainst.object as AbstractMesh).material = greenMat;
    }



  }


  // 触发器,跟物理无关,不需要使用物理引擎
  DetectTrigger(): void {

    const box = MeshBuilder.CreateBox("box", { width: 4, height: 1, depth: 4 });
    box.position.y = 0.5;
    box.visibility = 0.25;

    let num = 0;
    //每一帧渲染之前执行指定的回调函数。这个方法通常用于执行一些需要在每一帧更新的逻辑
    this.scene.registerBeforeRender(() => {
      // box.intersects//射线
      // box.intersectsMesh(this.sphere)  //网格
      // 检测两个网格（mesh）是否相交的方法
      if (box.intersectsMesh(this.sphere)) num++;

      if (num === 1) console.log("intersects", box.intersectsMesh(this.sphere));
    })



  }
}
