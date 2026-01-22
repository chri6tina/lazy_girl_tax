import StaticPage from '../components/StaticPage';
import { loadPage } from '../lib/pageLoader';

export default function HowItWorks(props) {
  return <StaticPage {...props} />;
}

export async function getStaticProps() {
  return {
    props: loadPage('how-it-works')
  };
}
