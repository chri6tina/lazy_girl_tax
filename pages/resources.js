import StaticPage from '../components/StaticPage';
import { loadPage } from '../lib/pageLoader';

export default function Resources(props) {
  return <StaticPage {...props} />;
}

export async function getStaticProps() {
  return {
    props: loadPage('resources')
  };
}
