import {
  Scene,
  Engine,
  FreeCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  CubeTexture,
  PBRMaterial,
  Texture,
  Color3,
  GlowLayer,
} from "@babylonjs/core";

export class PBR {
  scene: Scene;
  engine: Engine;

  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true);
    this.scene = this.CreateScene();

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  CreateScene(): Scene {
    const scene = new Scene(this.engine);
    const camera = new FreeCamera("camera", new Vector3(0, 1, -5), this.scene);
    camera.attachControl();
    camera.speed = 0.25

    const hemiLight = new HemisphericLight(
      "hemiLight",
      new Vector3(0, 1, 0),
      this.scene
    );

    // 创建了一种立方体贴图，通常用于呈现环境光照和反射。
    // 使用了预过滤数据创建了一个 CubeTexture。用于捕捉环境光照的信息
    // 场景纹理
    const envTex = CubeTexture.CreateFromPrefilteredData( // 创建并返回由 IBL Baker 或 Lys 等工具从预过滤数据创建的纹理
      "./environment/sky.env",
      scene
    );
    // 场景将使用这个环境纹理来模拟环境光照和反射效果
    scene.environmentTexture = envTex;

    // scene.createDefaultEnvironment
    // envTex 是用于呈现天空盒的纹理，true 表示天空盒将会被渲染
    scene.createDefaultSkybox(envTex, true)

    scene.environmentIntensity = 0.25;
    hemiLight.intensity = 0;

    const ground = MeshBuilder.CreateGround(
      "ground",
      { width: 10, height: 10 },
      this.scene
    );
    const ball = MeshBuilder.CreateSphere("ball", { diameter: 1 }, this.scene);
    ball.position = new Vector3(0, 1, 0);
    // 像镜子一样,因为PBR的粗糙度
    ground.material = this.CreateAsphalt();
    ball.material = this.CreateMagic();

    return scene;
  }
  CreateAsphalt(): PBRMaterial { //这里也可以返回很多PBR不同的材质,PBRMaterial是基础材质
    const pbr = new PBRMaterial("pbr", this.scene)

    // diffuse漫反射纹理通常包含了物体表面的颜色信息
    pbr.albedoTexture = new Texture("./textures/asphalt/asphalt_diffuse.jpg", this.scene)
    pbr.roughness = 1

    pbr.bumpTexture = new Texture("./textures/asphalt/asphalt_normal.jpg", this.scene);
    pbr.invertNormalMapX = true;
    pbr.invertNormalMapY = true;
    // 红色通道（R通道）中获取环境遮蔽信息
    pbr.useAmbientOcclusionFromMetallicTextureRed = true;
    // 绿色通道（G通道）中获取粗糙度信息
    pbr.useRoughnessFromMetallicTextureGreen = true;
    // 蓝色通道（B通道）中获取金属度信息
    pbr.useMetallnessFromMetallicTextureBlue = true;
    // 包含了物体的金属度、粗糙度和环境遮蔽信息
    pbr.metallicTexture = new Texture(
      "./textures/asphalt/asphalt_ao_rough_metal.jpg",
      this.scene
    );
    // pbr.roughness = 1;
    return pbr
  }
  CreateMagic(): PBRMaterial {
    const pbr = new PBRMaterial("pbr", this.scene)

    // pbr.environmentIntensity = 0.25;
    pbr.albedoTexture = new Texture("./textures/magic/magic_baseColor.png", this.scene)
    pbr.bumpTexture = new Texture("./textures/magic/magic_normal.png", this.scene)

    pbr.invertNormalMapX = true;
    pbr.invertNormalMapY = true;
    pbr.useAmbientOcclusionFromMetallicTextureRed = true;
    pbr.useRoughnessFromMetallicTextureGreen = true;
    pbr.useMetallnessFromMetallicTextureBlue = true;

    pbr.metallicTexture = new Texture("./textures/magic/magic_ao_rough_metal.png", this.scene);
    pbr.emissiveColor = new Color3(1, 0, 0);
    // 设置了 PBR 材质的自发光纹理   这个纹理来定义物体的自发光部分
    pbr.emissiveTexture = new Texture("./textures/magic/magic_emissive.png", this.scene);
    pbr.emissiveIntensity = 1;
    const glowLayer = new GlowLayer("glow", this.scene)
    glowLayer.intensity = 0.3
    pbr.roughness = 1;
    return pbr
  }
}
