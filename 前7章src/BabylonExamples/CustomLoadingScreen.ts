import { ILoadingScreen } from "@babylonjs/core";

export class CustomLoadingScreen implements ILoadingScreen {
  loadingUIBackgroundColor!: string;
  loadingUIText!: string;

  constructor(
    private loader: HTMLElement,
    private loadingBar: HTMLElement,
    private percentLoaded: HTMLElement,
  ) {

  }

  displayLoadingUI(): void {
    this.loadingBar.style.width = "0%";
    this.percentLoaded.innerText = "0%";
  }
  hideLoadingUI(): void {
    this.loader.id = "loaded";
    this.loadingBar.style.width = "100%";
    this.percentLoaded.innerText = "100%";
    setTimeout(() => {
      this.loader.style.display = "none"  //
    }, 1000)
  }
  updateLoadStatus(status: string): void {
    this.loadingBar.style.width = `${status}%`;
    this.percentLoaded.innerText = `${status}%`;
  }
}