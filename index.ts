import axios from "axios";
import { writeFileSync } from "fs";
import naughty from "naughty-words";
import badwords from "wordfilter/lib/badwords.json";

const list: string[] = [];

async function init() {
  const _list: string[] = [];

  _list.push(...badwords);

  for (const lang in naughty) {
    _list.push(...naughty[lang as keyof typeof naughty]);
  }

  const { data: swearWords } = await axios.get<string>(
    "http://www.bannedwordlist.com/lists/swearWords.txt"
  );
  _list.push(...swearWords.split("\r\n"));

  const { data: common } = await axios.get<string>(
    "https://raw.githubusercontent.com/Rad-Web-Hosting/banned-subdomain-prefixes/master/common.txt"
  );
  _list.push(...common.split("\r\n"));

  const { data: commonReserved } = await axios.get(
    "https://gist.githubusercontent.com/citrusui/d755cf6bf8374d413fe8f453fa40f0c6/raw/daa677221daf045e301e6461f02e8bc61e8c6daf/reserved-words.txt"
  );
  _list.push(...commonReserved.split("\r\n"));
  list.push(...Array.from(new Set(_list)));

  writeFileSync("index.json", JSON.stringify(list));
  console.log(list.length);
}

init();

export default async function () {
  if (list && list.length) return list;
  else {
    await init();
    return list;
  }
}
