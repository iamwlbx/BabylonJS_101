// 物理速度也可说是某个方向给予的力的大小
并且添加碰撞器

import { Scene, Engine, SceneLoader, HemisphericLight, CubeTexture, FreeCamera, Vector3, CannonJSPlugin, MeshBuilder, PhysicsImpostor } from "@babylonjs/core";
import "@babylonjs/loaders";
import * as CANNON from "cannon";

export class PhysicsVelocity {
  scene: Scene;
  engine: Engine;
  camera!: FreeCamera;
  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true);
    this.scene = this.CreateScene(canvas);

    this.CreateEnvironment();
    this.CreateImpostors();
    this.CreateRocket();

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


    const camera = new FreeCamera("camera", new Vector3(0, 3, -10), scene);
    camera.attachControl(canvas, true);
    camera.minZ = .5;
    this.camera = camera;

    // 启用物理引擎
    scene.enablePhysics(
      // 全局重力
      new Vector3(0, -9.81, 0),
      // 每秒进行 10 次物理引擎更新
      new CannonJSPlugin(true, 10, CANNON)
    )

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
  }
  async CreateRocket(): Promise<void> {
    // const box = MeshBuilder.CreateBox(
    //   "box",
    //   { size: 1 },
    //   // this.scene
    // )
    const { meshes } = await SceneLoader.ImportMeshAsync(
      "",
      "/models/",
      "toon_rocket.glb",
      this.scene
    );
    // box.position.y = 1;
    // meshes[0].position.y = 2;
    const rocketCol = MeshBuilder.CreateBox("rocketCol", { width: 1, height: 1.7, depth: 1 })
    rocketCol.position.y = 0.85;
    rocketCol.visibility = 0;

    // 将rocketCol和火箭绑定在一起,将碰撞器与模型关联，并为其应用物理模拟，
    rocketCol.physicsImpostor = new PhysicsImpostor(
      rocketCol,
      PhysicsImpostor.BoxImpostor,  // box模仿者
      { mass: 1 }
    );

    // 将一个网格设置为另一个网格的子级 ==> 用途：
    // 1.组织场景层次结构：将多个网格组织成层次结构,以便管理,可以让其在场景中的位置和旋转相对于父级网格。
    // 2.变换继承：子级继承父级的变换，包括位置、旋转和缩放
    // 3.碰撞和物理仿真：碰撞检测和物理仿真时，以便进行更精确的碰撞检测和模拟。
    // 4.父级网格可能代表一个整体对象，而子级网格代表该对象的部分。
    // 5.可视化效果：创建复杂的可视化效果。例如，树的模型，树干和树叶是不同的子级网格，可以对它们应用不同的材质或动画效果。



    // 将 rocketCol 碰撞器作为父级分配给了 meshes[0]  rocketCol是meshes[0]的爸爸
    // 确保在火箭模型上应用物理效果时，也会影响到火箭碰撞器
    meshes[0].setParent(rocketCol);   //适合用于将一个网格精确地设置为另一个网格的子级，而不会影响子级的本地坐标系原点。
    // meshes[0].parent = rocketCol;  // 子级网格的本地坐标系原点会相对于父级网格的原点进行变换
    rocketCol.rotate(Vector3.Forward(), 1.5);
    // 设置物体的线性速度,需要确保物体已经启用了物理引擎，并且具有有效的物理仿真器
    // 将其发生的变化定义在函数中，再用帧发生器不断变化
    const rocketPhysics = () => {
      console.log('起飞~');

      this.camera.position = new Vector3(rocketCol.position.x, rocketCol.position.y, this.camera.position.z);
      // rocketCol.physicsImpostor?.applyForce(new Vector3(0,10,0),rocketCol.getAbsolutePosition())
      // rocketCol.physicsImpostor?.setLinearVelocity(new Vector3(0, 1, 0));
      rocketCol.physicsImpostor?.setLinearVelocity(rocketCol.up.scale(5));
      // 设置物体角速度（angular velocity）的方法。角速度是物体围绕其自身旋转的速度
      // rocketCol.physicsImpostor?.setAngularVelocity(new Vector3(0, 2, 0));
    }
    // rocketCol.physicsImpostor.setLinearVelocity(new Vector3(0, 10, 3));
    // setTimeout(() => {
    //   rocketCol.physicsImpostor!.setLinearVelocity(new Vector3(0, 20, -100))
    // }, 4000)
    let gameover = false;

    // if (!gameover) this.scene.registerBeforeRender(rocketPhysics);

    // this.scene.onPointerDown = () => {
    //   gameover = !gameover;
    //   console.log(gameover);
    //   this.scene.unregisterBeforeRender(rocketPhysics)
    // }

    // this.scene.registerBeforeRender(rocketPhysics);

    // this.scene.onPointerDown = () => {
    //   this.scene.unregisterBeforeRender(rocketPhysics)
    // }
    // 因重力影响掉下去
    if (!gameover) {
      this.scene.registerBeforeRender(rocketPhysics);
      gameover = !gameover;
    }
    this.scene.onPointerDown = () => {
      if (gameover) {
        this.scene.unregisterBeforeRender(rocketPhysics);
        gameover = !gameover;
      } else {
        this.scene.registerBeforeRender(rocketPhysics);
        gameover = !gameover;
      }
    }

  }
}
