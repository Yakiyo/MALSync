import { pageInterface } from '../pageInterface';
import { SyncPage } from '../syncPage';

export const Webtoons: pageInterface = {
  name: 'Webtoons',
  domain: ['webtoons.com'],
  languages: ['English'],
  type: 'manga',
  isSyncPage(url) {
    return url.split('/').length === 8 && url.split('/')[7].startsWith('viewer?title_no=');
  },
  isOverviewPage(url) {
    return (
      url.split('/').length >= 8 && url.split('/')[4] !== 'canvas' // ensure we're not under the canvas directory
    );
  },
  sync: {
    getTitle(url: string): string {
      return j.$('div.info > div.subj_info > a.subj').attr('title') as string;
    },
    getIdentifier(url: string): string {
      return utils.urlPart(url, 5);
    },
    getOverviewUrl(url: string): string {
      return j.$('div.info > div.subj_info > a.subj').attr('href') as string;
    },
    getEpisode(url: string): number {
      return Number(new URL(url).searchParams.get('episode_no'));
    },
    nextEpUrl: undefined,
    uiSelector: undefined,
    getMalUrl: undefined,
    readerConfig: undefined,
  },
  init: (page: SyncPage) => {
    page.handlePage();
  },
};
