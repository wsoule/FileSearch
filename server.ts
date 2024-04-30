import { Entries, FileData, FileType } from './types/entries.ts';

const entries: Entries = {
  dirs: [],
  file: {},
};

const readDir = async (filepath: string) => {
  for (const dirEntry of Deno.readDirSync(filepath)) {
    const fullFilePath = filepath + dirEntry.name;
    if (dirEntry.isFile) {
      const fileEntry = entries.file[dirEntry.name];
      const { size } = await Deno.stat(fullFilePath);
      // If file is aready in Entries.
      if (fileEntry) {
        // And there is a file with the same size.
        if (fileEntry.fileData[size]) {
          // Then make sure Duplicates is true.
          fileEntry.hasDuplicates = (fileEntry.hasDuplicates)
            ? fileEntry.hasDuplicates
            : true;
          fileEntry.fileData[size].push(fullFilePath);
        } else {
          fileEntry.fileData[size] = [fullFilePath];
        }
      } else {
        entries.file[dirEntry.name] = {
          fileData: {
            [size]: [fullFilePath],
          },
          hasDuplicates: false,
        };
      }
    } else if (dirEntry.isDirectory) {
      const nodeModules = new RegExp('node_modules');
      const git = new RegExp('\.git');
      const sitePackages = new RegExp('site-packages');
      const dotedFiles = new RegExp('\.\w+');
      const siteDir = new RegExp('Sites');
      const trashDir = new RegExp('Trash');
      const libraryDir = new RegExp('Library');
      if (
        !nodeModules.test(dirEntry.name) && !git.test(dirEntry.name) &&
        !sitePackages.test(dirEntry.name) && !dotedFiles.test(dirEntry.name) &&
        !siteDir.test(dirEntry.name) && !trashDir.test(dirEntry.name) &&
        !libraryDir.test(dirEntry.name)
      ) {
        entries.dirs.push(fullFilePath + '/');
      }
    }
  }
  const poppedEntry = entries.dirs.pop();
  if (poppedEntry) {
    await readDir(poppedEntry);
  }
};

await readDir('../../../../');
const duplicates = Object.entries(entries.file).map(
  ([filename, { fileData, hasDuplicates }]) => {
    return !hasDuplicates ? [] : {
      [filename]: Object.values(fileData).filter((fileArray) => {
        return fileArray.length > 1;
      }).flat(),
    };
  },
).flat();

console.log(duplicates);
