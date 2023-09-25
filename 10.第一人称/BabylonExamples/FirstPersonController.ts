// 重力和碰撞
import {
  Scene,
  Engine,
  SceneLoader,
  FreeCamera,
  Vector3,
  HemisphericLight
} from "@babylonjs/core";
import "@babylonjs/loaders";

export class FirstPersonController {
  scene: Scene;
  engine: Engine;

  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true);
    this.scene = this.CreateScene();

    this.CreateEnvironment();
    this.CreateController();

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
      if (evt.button === 1) this.engine.exitPointerlock();
    }

    const framesPersecond = 60;
    const gravity = -9.81;
    //物理引擎  模拟物体受到重力影响时的行为，使它以每秒9.81米/秒²的速度向下加速。
    scene.gravity = new Vector3(0, gravity / framesPersecond, 0);
    scene.collisionsEnabled = true; // 添加碰撞/可以碰撞




    return scene;
  }

  async CreateEnvironment(): Promise<void> {
    const { meshes } = await SceneLoader.ImportMeshAsync(
      "",
      "./models/",
      // "LightingScene.glb",
      "Prototype_Level.glb",
      this.scene
    );

    meshes.map((mesh) => {
      // 启用碰撞检测。当您将mesh.checkCollisions设置为true时，
      // 会自动处理该物体与其他物体之间的碰撞检测，以防止它们相互穿越或交叉
      mesh.checkCollisions = true;
    })
  }

  CreateController(): void {
    const camera = new FreeCamera("camera", new Vector3(0, 10, 0), this.scene)
    camera.attachControl()
    camera.applyGravity = true;   // 相机会受到场景中的重力影响，就像物理世界中的物体一样。
    camera.checkCollisions = true; // 启用碰撞检测

    // 创建一个椭圆,它代表着相机
    // 用于描述相机碰撞体积（通常是椭球体）的属性。
    // 这个碰撞体积用于模拟相机在场景中的碰撞行为，以防止相机穿过物体。
    camera.ellipsoid = new Vector3(1, 1, 1);
    // 相机与场景中物体之间的最小距离,超出的渲染会被裁剪.
    camera.minZ = 0.45;
    // 相机的移动速度
    camera.speed = 0.5;
    // 设置控制相机在鼠标或触摸屏上旋转时的敏感度
    camera.angularSensibility = 6000;

    // 设置关键keycode

    // 用于控制相机向前移动的按键数组
    camera.keysUp.push(87);
    camera.keysLeft.push(65);
    camera.keysDown.push(83);
    camera.keysRight.push(68);
  }
}
