import Fuse from 'fuse.js';

import { search } from '../_provider/searchFactory';
import { UserList as LocalList } from '../_provider/Local/list';
import { searchResult } from '../_provider/definitions';
import { listElement } from '../_provider/listAbstract';

export async function miniMALSearch(searchterm: string, type: 'anime' | 'manga') {
  return [...(await localSearch(searchterm, type)), ...(await search(searchterm, type))];
}

const searchFuse: {
  anime: null | Fuse<listElement>;
  manga: null | Fuse<listElement>;
} = {
  anime: null,
  manga: null,
};

async function localSearch(searchterm: string, type: 'anime' | 'manga'): Promise<searchResult[]> {
  if (!searchFuse[type]) {
    const localListEl = new LocalList(7, type);
    const tempList = await localListEl.getCompleteList();
    searchFuse[type] = new Fuse(tempList, {
      keys: ['title'],
    });
  }

  const results = searchFuse[type]!.search(searchterm);

  return results.map(el => {
    return {
      id: 0,
      name: el.item.title,
      altNames: [],
      url: el.item.url,
      malUrl: () => Promise.resolve(null),
      image: el.item.image,
      media_type: el.item.type,
      isNovel: false,
      score: '',
      year: '',
    };
  });
}
