import {
  Scene,
  Engine,
  FreeCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  StandardMaterial,
  Texture,
} from "@babylonjs/core";

export class StandardMaterials {
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
    camera.speed = 0.25;

    const hemiLight = new HemisphericLight(
      "hemiLight",
      new Vector3(0, 1, 0),
      this.scene
    );

    hemiLight.intensity = 1;

    const ground = MeshBuilder.CreateGround(
      "ground",
      { width: 10, height: 10 },
      this.scene
    );

    const ball = MeshBuilder.CreateSphere("ball", { diameter: 1 }, this.scene);

    ball.position = new Vector3(0, 1, 0);

    ground.material = this.CreateGroundMaterial();
    ball.material = this.CreateBallMaterial();

    return scene;
  }
  /**
    * 
    * @returns 返回包含了设置好纹理贴图的地面材质对象
    */
  CreateGroundMaterial(): StandardMaterial {
    const groundMat = new StandardMaterial("groundMat", this.scene);
    const uvScale = 4;
    const texArray: Texture[] = [];

    const diffuseTex = new Texture("./textures/stone/stone_diffuse.jpg", this.scene);
    groundMat.diffuseTexture = diffuseTex;
    texArray.push(diffuseTex);

    const normalTex = new Texture("./textures/stone/stone_normal.jpg", this.scene);
    groundMat.bumpTexture = normalTex;
    groundMat.invertNormalMapX = true;
    groundMat.invertNormalMapY = true;
    texArray.push(normalTex);

    const aoTex = new Texture("./textures/stone/stone_ao.jpg", this.scene);
    groundMat.ambientTexture = aoTex;
    texArray.push(aoTex);

    const specTex = new Texture("./textures/stone/stone_spec.jpg", this.scene);
    groundMat.specularTexture = specTex;
    texArray.push(specTex);

    texArray.forEach((tex) => {
      tex.uScale = uvScale;
      tex.vScale = uvScale;
    });

    return groundMat;
  }
  /**
   * 
   * @returns 返回包含了设置好纹理贴图的球体材质对象
   */
  CreateBallMaterial(): StandardMaterial {

    const ballMat = new StandardMaterial("ballMat", this.scene)
    const uvScale = 1;
    const texArray: Texture[] = []; // 存储纹理的数组

    // diffuseTex：漫反射纹理。
    const diffuseTex = new Texture("./textures/metal/metal_diffuse.jpg", this.scene);
    ballMat.diffuseTexture = diffuseTex;
    texArray.push(diffuseTex)
    // normalTex：法线纹理。
    const normalTex = new Texture("./textures/metal/metal_normal.jpg", this.scene);
    ballMat.bumpTexture = normalTex;
    // 调整法线贴图的方向，以确保其与模型的法线方向正确匹配，从而获得预期的视觉效果
    ballMat.invertNormalMapX = true;
    ballMat.invertNormalMapY = true;
    texArray.push(normalTex)

    // aoTex：环境遮蔽（Ambient Occlusion）纹理。
    const aoTex = new Texture("./textures/metal/metal_ao.jpg", this.scene);
    ballMat.ambientTexture = aoTex;
    texArray.push(aoTex)
    // specTex：高光（Specular）纹理。
    const specTex = new Texture("./textures/metal/metal_spec.jpg", this.scene);
    ballMat.specularTexture = specTex;
    // 高光强度是一个材质属性，它控制了材质的高光部分的明亮程度和锐度。
    ballMat.specularPower = 1;
    texArray.push(specTex)

    texArray.forEach((tex) => {
      tex.uScale = uvScale;
      tex.vScale = uvScale;
    })



    // const groundMat = new StandardMaterial(
    //   "groundMat",
    //   this.scene
    // )





    return ballMat
  }
}