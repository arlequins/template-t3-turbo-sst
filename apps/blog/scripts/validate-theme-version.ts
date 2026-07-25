import packageJson from "../package.json";
import themeManifest from "../theme.json";

if (packageJson.version !== themeManifest.version) {
  throw new Error(
    `Theme version mismatch: package.json=${packageJson.version}, theme.json=${themeManifest.version}`,
  );
}

console.log(`Blog theme version ${themeManifest.version} is aligned`);
