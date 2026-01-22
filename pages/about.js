import StaticPage from '../components/StaticPage';
import { loadPage } from '../lib/pageLoader';

export default function About(props) {
  return <StaticPage {...props} />;
}

export async function getStaticProps() {
  return {
    props: loadPage('about')
  };
}
