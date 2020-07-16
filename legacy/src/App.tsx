import React, {
  Component
} from 'react';
import * as THREE from 'three';

import Footer from './components/Footer';
import Main from './components/Main';
import {
  ApiData
  , ProjectsApi
  , GQLRequest
} from './interfaces';
import versions from './CHANGELOG';

import smoke from './img/smoke.png';

const API_URL = 'https://i1mxgd4l94.execute-api.us-west-1.amazonaws.com/dev/';
const MAX_API_RETRIES = 3;

const currentVersion = versions[0]['version'];

interface State {
  component: string;
  api: ApiData;
}

interface App {
  mount?: any;
}

class App extends Component<{}, State> {
  state: State = {
    component: 'LandingPage'
    //  Initializing API data state
    //  Is there a better way to do this?
    , api: {
      'Projects': {
        'projects': []
        , 'status': 0
      }
    }
  };

  componentDidMount(): void {
    this.renderVisuals();
    this.loadProjectsApi();
  };

  renderVisuals(): void {
    let scene: THREE.Scene = new THREE.Scene();
    let camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(60,
      window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 1;
    camera.rotation.x = 1.16;
    camera.rotation.y = -0.12;
    camera.rotation.z = 0.27;

    let ambient: THREE.AmbientLight = new THREE.AmbientLight(0x555555);
    scene.add(ambient);

    let renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    let cloudParticles: THREE.Mesh[] = [];

    scene.fog = new THREE.FogExp2(0x011014, 0.001);
    renderer.setClearColor(scene.fog.color);

    this.mount.appendChild(renderer.domElement);

    //  Render the sick visuals
    let renderScene = function () {
      renderer.render(scene, camera);
      requestAnimationFrame(renderScene);
      cloudParticles.forEach(p => {
        p.rotation.z -= 0.001;
      });
    };

    let loader = new THREE.TextureLoader();

    //  Load clouds
    loader.load(smoke, function (texture) {
      let cloudGeo = new THREE.PlaneBufferGeometry(500, 500);
      let cloudMaterial = new THREE.MeshLambertMaterial({
        map: texture,
        transparent: true
      });
      for(let p = 0; p < 50; p++) {
        let cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
        cloud.position.set(
          Math.random() * 800 - 400
          , 500
          , Math.random() * 500 - 500
        );
        cloud.rotation.x = 1.16;
        cloud.rotation.y = -0.12;
        cloud.rotation.z = Math.random() * 2 * Math.PI;
        cloud.material.opacity = 0.55;
        cloudParticles.push(cloud);
        scene.add(cloud);
      }
    });

    //  Lights
    let darkBlueLight: THREE.PointLight =
      new THREE.PointLight(0x021024, 50, 450, 1.7);
    let blueLight: THREE.PointLight =
      new THREE.PointLight(0x0000cc, 50, 450, 1.7);
    let lochmaraLight: THREE.PointLight =
      new THREE.PointLight(0x3677ac, 50, 450, 1.7);

    darkBlueLight.position.set(100, 300, 100);
    blueLight.position.set(100, 300, 100);
    lochmaraLight.position.set(300, 300, 200);

    scene.add(darkBlueLight);
    scene.add(blueLight);
    scene.add(lochmaraLight);

    //  Resize scene on window resize
    let onWindowResize = function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    renderScene();
    window.addEventListener('resize', onWindowResize, false);
  };

  async loadProjectsApi(): Promise<void> {
    let attempts: number = 0;

    while (attempts < MAX_API_RETRIES) {
      let projs: ProjectsApi;

      try {
        projs = await this.fetchApi<ProjectsApi>(API_URL, {
          query: '{ projects { project_id title description about url source_code_url languages { name color } tools { name color } } }'
        });
      } catch (e) {
        attempts++;
        console.log('ERR: ' + e);
        console.log('Failed API call attempts: ' + attempts);
        continue;
      }

      //  Try again if bad response received
      if (projs.status === 200) {
        this.setState(prevState => ({
          api: {
            ...prevState.api
            , 'Projects': projs
          }
        }));
        return;
      }
      attempts++;
      console.log('ERR: API status code: ' + projs.status);
      console.log('Failed API call attempts: ' + attempts);
    }
    console.log('ERR: failed to fetch from API.');
  };

  async fetchApi<T>(req: RequestInfo, body: GQLRequest): Promise<T> {
    try {
      const res = await fetch(req, {
        method: 'POST'
        , headers: {
          'Content-Type': 'application/json'
        }
        , body: JSON.stringify(body)
      });

      let api = await res.json();
      api.data.status = res.status;
      return api.data;

    } catch (e) {
      throw Error("Could not successfully make API call.");
    }
  };

  changeComponent = (newComponent: string): void => {
    this.setState({
      component: newComponent
    });
  };

  public render (): JSX.Element {
    return (
      <div
        className='App'
      >
        <div
          ref={ref => (this.mount = ref)}
          className='visuals-scene'
        ></div>
        <Main
          api={this.state.api}
          component={this.state.component}
          changeComponent={this.changeComponent}
        />
        <Footer
          changeComponent={this.changeComponent}
          currentVersion={currentVersion}
        />
      </div>
    );
  };
}

export default App;
