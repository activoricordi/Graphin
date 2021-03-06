import React, { useContext, useState, useEffect } from 'react';
import type { IRouteComponentProps } from '@umijs/types';
import { context, Link } from 'dumi/theme';
import Navbar from './components/Navbar';
import SideMenu from './components/SideMenu';
import SlugList from './components/SlugList';
import SearchBar from './components/SearchBar';
import Cases from './components/Cases/Cases';
import Banner from './components/Banner/index';
import Ideas from './components/Features';

import './style/layout.less';

const Hero = hero => (
  <div className="__dumi-default-layout-hero">
    {hero.image && <img src={hero.image} />}
    <h1>{hero.title}</h1>
    <div dangerouslySetInnerHTML={{ __html: hero.desc }} />
    {hero.actions &&
      hero.actions.map(action => (
        <Link to={action.link} key={action.text}>
          <button type="button">{action.text}</button>
        </Link>
      ))}
  </div>
);

const BannerPanel = banner => {
  const { image, title, desc, actions } = banner;
  const description = <div dangerouslySetInnerHTML={{ __html: desc }} />;
  const coverImage = <img alt="graphin" style={{ width: '100%', marginTop: '20%' }} src={image} />;

  const notifications = [
    {
      type: '重磅推出',
      title: 'AntV图可视分析解决方案，来啦～',
      date: '2020.11.22',
      link: 'https://www.yuque.com/antv/g6/solution',
    },
    {
      type: '小试牛刀',
      title: 'Graphin 1.0.0 全新发布！',
      date: '2019.11.22',
      link: 'https://github.com/antvis/graphin',
    },
  ];
  return (
    <Banner
      coverImage={coverImage}
      title={title}
      // @ts-ignore
      description={description}
      notifications={notifications}
      buttons={actions}
      className="banner"
    />
  );
};

const FeaturePanel = meta => {
  return <Ideas features={meta.features} style={{ width: '100%' }} />;
};

const Features = features => (
  <div className="__dumi-default-layout-features">
    {features.map(feat => (
      <dl key={feat.title} style={{ backgroundImage: feat.icon ? `url(${feat.icon})` : undefined }}>
        {feat.link ? (
          <Link to={feat.link}>
            <dt>{feat.title}</dt>
          </Link>
        ) : (
          <dt>{feat.title}</dt>
        )}
        <dd dangerouslySetInnerHTML={{ __html: feat.desc }} />
      </dl>
    ))}
  </div>
);

const Layout: React.FC<IRouteComponentProps> = ({ children, location }) => {
  const {
    config: { mode, repository },
    meta,
    locale,
  } = useContext(context);
  console.log('meta', meta);
  const { url: repoUrl, branch, platform } = repository;
  const [menuCollapsed, setMenuCollapsed] = useState<boolean>(true);
  const isSiteMode = mode === 'site';
  const showHero = isSiteMode && meta.hero;
  const showBanner = isSiteMode && meta.banner;
  const showCases = isSiteMode && meta.cases;
  const showFeatures = isSiteMode && meta.features;
  const showIdeas = isSiteMode && meta.ideas;
  const showSideMenu = meta.sidemenu !== false && !showHero && !showBanner && !showFeatures && !meta.gapless;
  const showSlugs =
    !showHero &&
    !showBanner &&
    !showFeatures &&
    Boolean(meta.slugs?.length) &&
    (meta.toc === 'content' || meta.toc === undefined) &&
    !meta.gapless;
  const isCN = /^zh|cn$/i.test(locale);
  const updatedTime: any = new Date(meta.updatedTime).toLocaleString([], { hour12: false });
  const repoPlatform =
    { github: 'GitHub', gitlab: 'GitLab' }[(repoUrl || '').match(/(github|gitlab)/)?.[1] || 'nothing'] || platform;

  return (
    <div
      className={`__dumi-default-layout ${showBanner ? 'home' : ''}`}
      data-route={location.pathname}
      data-show-sidemenu={String(showSideMenu)}
      data-show-slugs={String(showSlugs)}
      data-site-mode={isSiteMode}
      data-gapless={String(!!meta.gapless)}
      onClick={() => {
        if (menuCollapsed) return;
        setMenuCollapsed(true);
      }}
    >
      <Navbar
        location={location}
        navPrefix={<SearchBar />}
        onMobileMenuClick={ev => {
          setMenuCollapsed(val => !val);
          ev.stopPropagation();
        }}
      />
      {showSideMenu && <SideMenu mobileMenuCollapsed={menuCollapsed} location={location} />}
      {showSlugs && <SlugList slugs={meta.slugs} className="__dumi-default-layout-toc" />}
      {showBanner && BannerPanel(meta.banner)}
      {showHero && Hero(meta.hero)}
      {showFeatures && Features(meta.features)}
      {showIdeas && <Ideas features={meta.ideas} style={{ width: '100%' }} />}
      {showCases && <Cases cases={meta.cases} className="graph-cases" />}
      <div className="__dumi-default-layout-content">
        {children}
        {!showHero && !showFeatures && meta.filePath && !meta.gapless && (
          <div className="__dumi-default-layout-footer-meta">
            {repoPlatform && (
              <Link to={`${repoUrl}/edit/${branch}/${meta.filePath}`}>
                {isCN ? `在 ${repoPlatform} 上编辑此页` : `Edit this doc on ${repoPlatform}`}
              </Link>
            )}
            <span data-updated-text={isCN ? '最后更新时间：' : 'Last update: '}>{updatedTime}</span>
          </div>
        )}
        {(showHero || showFeatures) && meta.footer && (
          <div className="__dumi-default-layout-footer" dangerouslySetInnerHTML={{ __html: meta.footer }} />
        )}
      </div>
    </div>
  );
};

export default Layout;
