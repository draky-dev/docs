import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  //Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Not opinionated",
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        <strong>draky</strong> doesn't ship with any images that you would need to figure out how to configure or
        replace. It is designed to easily utilize and enhance any existing image, so you can design your environment
        as you wish.
      </>
    ),
  },
  {
    title: 'Allows you to work directly with docker',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        <strong>draky</strong> doesn't hide your environment's configuration behind the layers of abstraction. You
        can directly see, and modify your <code>docker-compose.yml</code> file.
      </>
    ),
  },
  {
    title: 'Designed to help',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        <strong>draky</strong> helps you with:
        <ul>
          <li>Running custom scripts inside the containers.</li>
          <li>Creating templates for your environments.</li>
          <li><code>draky-entrypoint</code> provides you with some helpers, like a generic mechanism that allows you
          to override any files in any image on the container's startup without the need of adding volumes.</li>
        </ul>
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--left padding-horiz--md">
        <h3 className='text--center'>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
