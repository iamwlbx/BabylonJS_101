import {
  Scene,
  Engine,
  FreeCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  SceneLoader,
  AbstractMesh,
  GlowLayer,
  LightGizmo,
  GizmoManager,
  Light,
  Color3,
  DirectionalLight,
  PointLight,
  SpotLight,
  ShadowGenerator,

} from "@babylonjs/core";
import "@babylonjs/loaders";

export class LightsShadows {
  scene: Scene;
  engine: Engine;
  lightTubes!: AbstractMesh[];  //如果不在构造函数中分配的话需要加! 让ts知道会分配它的
  models!: AbstractMesh[];
  ball!: AbstractMesh;

  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true);
    this.scene = this.CreateScene();
    this.CreateEnvironment();

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }
  public resize(): void {
    console.log("重绘中...");

    if (this.scene) {
      this.scene.getEngine().resize();
    }
  }
  CreateScene(): Scene {
    const scene = new Scene(this.engine);
    const camera = new FreeCamera("camera", new Vector3(0, 1, -4), this.scene);
    camera.attachControl();
    camera.speed = 0.2;

    return scene;
  }

  async CreateEnvironment(): Promise<void> {
    const { meshes } = await SceneLoader.ImportMeshAsync(
      "",
      "./models/",
      "LightingScene.glb"
    );

    this.models = meshes;
    // console.log(this.models);

    this.lightTubes = meshes.filter(
      (mesh) =>
        mesh.name === "lightTube_left" || mesh.name === "lightTube_right"
    );

    this.ball = MeshBuilder.CreateSphere("ball", { diameter: 0.5 }, this.scene);

    this.ball.position = new Vector3(0, 1, -1);

    // Glow Layer（发光层）对象，该对象用于在场景中添加发光效果
    const glowLayer = new GlowLayer("glowLayer", this.scene);
    glowLayer.intensity = 0.75;

    this.CreateLight()
  }

  CreateLight(): void {
    // const hemiLight = new HemisphericLight("hemiLight", new Vector3(0, 1, 0), this.scene)
    // hemiLight.diffuse = new Color3(1, 0, 0)
    // hemiLight.groundColor = new Color3(0, 0, 1) //地面反射的光的颜色
    // hemiLight.specular = new Color3(0, 1, 0)    //镜面高光颜色
    // this.CreateGizmos(hemiLight)

    // const directionalLight = new DirectionalLight("directionalLight", new Vector3(0, -1, 0), this.scene)
    // this.CreateGizmos(directionalLight)

    const pointLight = new PointLight("pointLight", new Vector3(0, 1, 0), this.scene)
    pointLight.diffuse = new Color3(172 / 255, 246 / 255, 250 / 255)
    pointLight.intensity = 0.25
    const pointClone = pointLight.clone("pointClone") as PointLight;

    // 将点光源附加到了（this.lightTubes[0]） 
    // 意味着点光源的位置将相对于 this.lightTubes[0] 的位置。
    // 附加光源到其他物体可以模拟灯泡等发光物体的效果。
    pointLight.parent = this.lightTubes[0];
    pointClone.parent = this.lightTubes[1]


    const spotLight = new SpotLight(
      "spotlight",
      new Vector3(0, .5, -3),
      new Vector3(0, 1, 3),
      Math.PI / 2,
      10,
      this.scene)
    spotLight.intensity = 100;

    spotLight.shadowEnabled = true
    spotLight.shadowMinZ = 1;
    spotLight.shadowMaxZ = 10;
    const shadowGen = new ShadowGenerator(2048, spotLight)
    shadowGen.useBlurCloseExponentialShadowMap = true // 提供一个过滤器

    // this.ball.receiveShadows = true;
    // shadowGen.addShadowCaster(this.ball);
    this.models.forEach((m) => {
      m.receiveShadows = true;
      console.log(m);

      shadowGen.addShadowCaster(m)
    })


    this.CreateGizmos(spotLight)
    this.CreateGizmos(pointLight)
    // this.CreateGizmos(pointClone)






  }




  /**
   * 创建一个光源的可视化 Gizmo，并将其添加到场景中，
   * 以便用户可以使用 Gizmo 调整光源的位置和旋转等属性
   * @param customLight 
   */
  CreateGizmos(customLight: Light): void {

    /*
    "Gizmo" 是一个用于用户界面中的交互式工具，
    通常用于编辑或操作三维场景中的物体或属性
    Gizmo 通常由箭头、旋钮、轴线和其他控制元素组成，
    它们可视化地表示了三维空间中的变换操作
    用户可以通过点击、拖拽或操作 Gizmo 上的控制元素来改变物体(mesh)的位置、旋转或缩放 
     */




    // 创建了一个 LightGizmo，这是一个用于可视化光源的工具。它通常用于交互式地调整光源的属性
    const lightGizmo = new LightGizmo();
    // 设置了 LightGizmo 的缩放比例，将其放大了两倍
    lightGizmo.scaleRatio = 2;
    // 将要调整的光源（customLight）与 LightGizmo 关联，意味着可以使用 Gizmo 来控制这个光源的属性
    lightGizmo.light = customLight;

    // 创建了一个 GizmoManager，它用于管理场景中的 Gizmo
    const gizmoManager = new GizmoManager(this.scene);
    // 启用了位置 Gizmo，这允许您在场景中调整物体的位置。
    gizmoManager.positionGizmoEnabled = true;
    // 启用了旋转 Gizmo，这允许您在场景中调整物体的旋转。
    gizmoManager.rotationGizmoEnabled = true;
    // 不会跟随鼠标指针移动
    gizmoManager.usePointerToAttachGizmos = false;
    gizmoManager.attachToMesh(lightGizmo.attachedMesh);
  }

}
