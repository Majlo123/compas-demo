import * as fs from 'fs';
import { PackageJson } from 'type-fest';

const getPackageData = (path: string): PackageJson => {
  const packageJsonContent = fs.readFileSync(path, 'utf8');
  return JSON.parse(packageJsonContent) as PackageJson;
};

export const version = (path = './package.json'): string => {
  return getPackageData(path).version!;
};

export const name = (path = './package.json'): string => {
  return getPackageData(path).name!;
};
