import {
  Scene,
  Engine,
  FreeCamera,
  Vector3,
  CubeTexture,
  SceneLoader,
  AbstractMesh,
  ArcRotateCamera,
} from "@babylonjs/core";
import "@babylonjs/loaders";

export class CameraMechanics {
  scene: Scene;
  engine: Engine;
  watch!: AbstractMesh;
  camera!: ArcRotateCamera;
  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true);
    this.scene = this.CreateScene();

    this.CreateCamera();

    this.engine.displayLoadingUI();

    this.CreateWatch();

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

    const envTex = CubeTexture.CreateFromPrefilteredData(
      "./environment/xmas_bg.env",
      scene
    );

    envTex.gammaSpace = false;

    scene.environmentTexture = envTex;

    scene.createDefaultSkybox(envTex, true, 1000, 0.25);

    return scene;
  }

  CreateCamera(): void {
    this.camera = new ArcRotateCamera(
      "camera",
      - Math.PI / 2,
      Math.PI / 2,
      5,
      Vector3.Zero(),
      this.scene
    )


    this.camera.attachControl(this.canvas, true);
    this.camera.wheelPrecision = 100; //滚轮速度（高=>慢）
    // 定义了相机的近裁剪平面的距离，即相机到场景中的物体的最短距离。
    // 任何距离小于 minZ 的物体将被相机裁剪掉，不会在渲染中显示。
    // 可以避免太近的物体在渲染中产生不自然的效果。
    this.camera.minZ = 0.3; // 剪裁平面
    this.camera.lowerRadiusLimit = 1;
    this.camera.upperRadiusLimit = 5;

    this.camera.panningSensibility = 0;  //平移敏感度
    this.camera.useBouncingBehavior = true;  //回弹
    this.camera.useAutoRotationBehavior = true  //自动旋转
    this.camera.autoRotationBehavior!.idleRotationSpeed = 0.5;  //旋转速度
    this.camera.autoRotationBehavior!.idleRotationSpinupTime = 1000;  //从停止到达最大旋转速度所需的时间
    this.camera.autoRotationBehavior!.idleRotationWaitTime = 2000;  //自动旋转模式下等待的时间
    this.camera.autoRotationBehavior!.zoomStopsAnimation = true;  //尝试缩放（放大或缩小）相机视图时，自动旋转动画会停止。

    this.camera.useFramingBehavior = true
    this.camera.framingBehavior!.radiusScale = 8;
    this.camera.framingBehavior!.framingTime = 4000

  }

  async CreateWatch(): Promise<void> {
    const { meshes } = await SceneLoader.ImportMeshAsync(
      "",
      "./models/",
      "Vintage_Watch.glb"
    );

    this.watch = meshes[0];
    // meshes[1].showBoundingBox = true;
    // meshes[2].showBoundingBox = true;
    // meshes[3].showBoundingBox = true;
    console.log(this.watch);

    this.camera.setTarget(meshes[2]);
    this.engine.hideLoadingUI();
  }
}
