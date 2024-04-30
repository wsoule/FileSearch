export type Entries = {
  dirs: string[];
  file: {
    [key: string]: FileType;
  };
  // Record<string, FileType>; //Record<string, FileData[]>;
};

export type FileData = Record<string, string[]>;

export type FileType = {
  fileData: FileData;
  hasDuplicates: boolean;
};
