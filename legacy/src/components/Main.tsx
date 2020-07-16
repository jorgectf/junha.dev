import React, {
  Component
  , Suspense
  , lazy
} from 'react';
import LoadingScreen from './LoadingScreen';

import { ApiData } from '../interfaces';

interface Props {
  api: ApiData;
  component: string;
  changeComponent: (newComponent: string) => void;
}

const LandingPage = lazy( () => import('./LandingPage'));
const AboutMe = lazy( () => import('./Portfolio/AboutMe'));
const ViewResume = lazy( () => import('./Portfolio/ViewResume'));
const Projects = lazy( () => import('./Portfolio/Projects'));
const Contact = lazy( () => import('./Portfolio/Contact'));

const VersionLog = lazy( () => import('./VersionLog'));
const NotFound = lazy( () => import('./ApiHandlers/404'));

export default class Main extends Component<Props> {
  renderComponent = (component: string): JSX.Element => {
    switch (component) {
      case 'LandingPage':
        return (
          <LandingPage
            changeComponent={this.props.changeComponent}
          />
        );
      case 'AboutMe':
        return (
          <AboutMe />
        );
      case 'Contact':
        return (
          <Contact />
        );
      case 'Resume':
        return (
          <ViewResume />
        );
      case 'Projects':
        return (
          <Projects
            projects={this.props.api.Projects}
          />
        );
      case 'VersionLog':
        return (
          <VersionLog />
        );
      default:
        return (
          <NotFound />
        );
    }
  };

  render (): JSX.Element {
    return (
      <div className='Main'>
        <Suspense fallback={
          <div>
            <LoadingScreen centered/>
          </div>
        }>
          { this.renderComponent(this.props.component) }
        </Suspense>
      </div>
    );
  };
}
