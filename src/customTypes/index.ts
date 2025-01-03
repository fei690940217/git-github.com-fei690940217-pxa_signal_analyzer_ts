export type OFDMType = 'DFT' | 'CP';
export type AddDirType = {
  id: string;
  dirName: string;
  description: string;
  createdAt: string;
};

export type OpenTheProjectWindowPayload = {
  projectName: string;
  subProjectName?: string;
};
