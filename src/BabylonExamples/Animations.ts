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
  Matrix,
  Animation
} from "@babylonjs/core";
import "@babylonjs/loaders";
import Ammo from "ammojs-typed";
// import * as CANNON from "cannon";

export class Animations {
  scene: Scene;
  engine: Engine;
  camera!: FreeCamera;
  target!: AbstractMesh;

  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true);

    this.scene = this.CreateScene(canvas);

    this.CreateEnvironment();
    this.CreateTarget();
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
  async CreateTarget(): Promise<void> {
    const { meshes } = await SceneLoader.ImportMeshAsync(
      "",           // public
      "./models/",   // public ./model/
      "target.glb", // public ./model/ target.glb
      this.scene
    )
    meshes.shift();
    // 将从模型文件中加载的多个网格合并成一个单一的网格
    // 将 meshes 数组中的所有网格合并成一个单一的网格
    this.target = Mesh.MergeMeshes(
      meshes as Mesh[],
      true,   // 保持其原始位置和旋转
      true,   // 保持其原始缩放
      undefined,  //表示没有父级网格
      false,    //表示不复制子级网格
      true    // 表示合并后的网格保持其原始材质
    )!;
    this.target.position.y = 3;
    this.CreateAnimations();
  }


  CreateAnimations(): void {
    // 创建存储动画帧的数组
    const rotateFrames = [];
    const slideFrames = [];
    const fadeFrames = [];

    const fps = 60;
    // 创建动画以及具体的动画配置项
    const rotateAnim = new Animation(
      "rotateAnim",
      "rotation.z",
      fps + 500,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CYCLE
    );
    const slideAnim = new Animation(
      "slideAnim",
      "position",
      fps,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CYCLE
    );
    const fadeAnim = new Animation(
      "fadeAnim",
      "visibility",
      fps,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CONSTANT
    )
    // 将关键帧存入数组
    rotateFrames.push({ frame: 0, value: 0 });
    rotateFrames.push({ frame: 180, value: Math.PI / 2 });
    slideFrames.push({ frame: 0, value: new Vector3(0, 3, 0) });
    slideFrames.push({ frame: 45, value: new Vector3(-3, 2, 0) });
    slideFrames.push({ frame: 90, value: new Vector3(0, 3, 0) });
    slideFrames.push({ frame: 135, value: new Vector3(3, 2, 0) });
    slideFrames.push({ frame: 180, value: new Vector3(0, 3, 0) });
    fadeFrames.push({ frame: 0, value: 1 });
    fadeFrames.push({ frame: 180, value: 0 });
    // 设置关键帧
    rotateAnim.setKeys(rotateFrames);
    slideAnim.setKeys(slideFrames);
    fadeAnim.setKeys(fadeFrames)
    // 将动画存入Mesh的动画属性中
    this.target.animations.push(rotateAnim);
    this.target.animations.push(slideAnim);
    this.target.animations.push(fadeAnim);
    // 创建回调,用于动画结束时调用
    const onAnimationEnd = () => {
      console.log("动画暂停");
      this.target.setEnabled(false)
    }

    // this.scene.beginAnimation(this.target, 0, 180, true);
    const animControl = this.scene.beginDirectAnimation(
      this.target,
      [slideAnim, rotateAnim],
      0,
      180,
      true,
      1,
      onAnimationEnd  // 结束时调用 打印暂停，设置Enabled为false
    );
    // 手动关停动画
    this.scene.onPointerDown = async (e) => {
      console.log(e);
      if (e.button === 1) {
        await this.scene.beginDirectAnimation(
          this.target,
          [fadeAnim],
          0,
          180,
        ).waitAsync();  //d等待淡出动画结束，停止其他动画
        animControl.stop();
      }
    }
  }
}
