import { Scene, Engine, FreeCamera, Vector3, HemisphericLight, MeshBuilder } from "@babylonjs/core"
// import * as b from "@babylonjs/core"
/**
 * 创建基础场景&处理场景
 * @param dom  操作的dom
 * @param data  使用数据
 * @author xiemeng
 */

export class BasicScene {




  scene: Scene
  engine: Engine


  //在构造函数中抓取canvas
  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true)
    //创建单独方法处理场景
    this.scene = this.CreateScene()
    //渲染循环 
    this.engine.runRenderLoop(() => {
      this.scene.render()
    })

  }
  CreateScene(): Scene {
    const scene = new Scene(this.engine)
    const camera = new FreeCamera(
      "camera",
      new Vector3(0, 1, -5),
      this.scene,
    )
    camera.attachControl()
    //放在世界的什么地方不重要,指向的方向重要,用于补光
    const hemiLight = new HemisphericLight(
      "hemiLight",
      new Vector3(0, 1, 0),
      this.scene
    )
    //设置光的属性
    hemiLight.intensity = 0.5

    const ground = MeshBuilder.CreateGround(
      "ground",
      { width: 10, height: 10 },
      this.scene
    )
    const ball = MeshBuilder.CreateSphere(
      "ball",
      { diameter: 2 },
      this.scene
    )
    ball.position = new Vector3(0, 0.5, 0)
    // ball.position.x = 1














    return scene
  }
}