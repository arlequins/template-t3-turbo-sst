# Changelog

This project adheres to [Semantic Versioning](https://semver.org/).

## [1.2.0](https://github.com/arlequins/template-t3-turbo-sst/compare/template-t3-turbo-sst-v1.1.0...template-t3-turbo-sst-v1.2.0) (2026-07-23)


### Features

* 1.0.1 ([#2](https://github.com/arlequins/template-t3-turbo-sst/issues/2)) ([63c1012](https://github.com/arlequins/template-t3-turbo-sst/commit/63c10129d654d3517fa7369dde21130cfceb51b6))
* add no-restricted-properties ([#999](https://github.com/arlequins/template-t3-turbo-sst/issues/999)) ([2a16136](https://github.com/arlequins/template-t3-turbo-sst/commit/2a161360bfbd39053e518c9580e515c37dc5e77d))
* allow for merging `app.json` config file ([#903](https://github.com/arlequins/template-t3-turbo-sst/issues/903)) ([3ad573b](https://github.com/arlequins/template-t3-turbo-sst/commit/3ad573b57fe4a0fccfc1adbb04ff43282eaff335))
* **api:** add asynchronous application ports ([#42](https://github.com/arlequins/template-t3-turbo-sst/issues/42)) ([4f709e6](https://github.com/arlequins/template-t3-turbo-sst/commit/4f709e636927f25935cbcfb018dcc0f72f16ca4e))
* **api:** add deployment presets ([5193bca](https://github.com/arlequins/template-t3-turbo-sst/commit/5193bca587a3add085dcc8eb830ae3e62aae2697))
* **api:** add interactive OpenAPI explorer ([#44](https://github.com/arlequins/template-t3-turbo-sst/issues/44)) ([4a5a077](https://github.com/arlequins/template-t3-turbo-sst/commit/4a5a077d49e6ad7c6950b344cb6b32b86bff4b15))
* **api:** add provider-neutral request guards ([#31](https://github.com/arlequins/template-t3-turbo-sst/issues/31)) ([e2bed97](https://github.com/arlequins/template-t3-turbo-sst/commit/e2bed978cc2965a895b8ca11bc2a82ae6548bf71))
* **api:** establish Hono tRPC architecture ([aa1dde3](https://github.com/arlequins/template-t3-turbo-sst/commit/aa1dde37fbd263ecf57a3a0fbc13b99d7e001ce8))
* **api:** split liveness and readiness checks ([1df7f39](https://github.com/arlequins/template-t3-turbo-sst/commit/1df7f39c0d1506b609867f78893323033091793f))
* **auth:** implement OpenID Connect authentication ([809b91b](https://github.com/arlequins/template-t3-turbo-sst/commit/809b91be711e8dc44379f51ac138ff4f10f5a6c1))
* **auth:** provision users and enforce rbac ([5d7b970](https://github.com/arlequins/template-t3-turbo-sst/commit/5d7b970bc47a7a3fadc8f19505c0824bafd8a58d))
* better-auth ([#1321](https://github.com/arlequins/template-t3-turbo-sst/issues/1321)) ([2f2cfa8](https://github.com/arlequins/template-t3-turbo-sst/commit/2f2cfa8ce46fceeb5344233a4cd5bf9eb43945f0))
* cache `auth` in RSC ([#919](https://github.com/arlequins/template-t3-turbo-sst/issues/919)) ([5a6888a](https://github.com/arlequins/template-t3-turbo-sst/commit/5a6888a4b8d0ea07a9c6538cad1476d499946867))
* **cache:** add resilient cache policies ([#40](https://github.com/arlequins/template-t3-turbo-sst/issues/40)) ([66868d1](https://github.com/arlequins/template-t3-turbo-sst/commit/66868d1d3db567640f23497c2bd17ab61185a910))
* **cache:** add S3-backed application cache ([#28](https://github.com/arlequins/template-t3-turbo-sst/issues/28)) ([c54919f](https://github.com/arlequins/template-t3-turbo-sst/commit/c54919fed8d9b17a0afda997e0cddb927c1bb00e))
* **db:** add migration and seed workflow ([9bb2628](https://github.com/arlequins/template-t3-turbo-sst/commit/9bb2628859c2f672954847ccc95ed7b1a7522782))
* **db:** guard sample seed data by stage ([048eecf](https://github.com/arlequins/template-t3-turbo-sst/commit/048eecf9bbf04729f130005bfaca2d8cc4000d65))
* **db:** harden migration and recovery workflows ([9925968](https://github.com/arlequins/template-t3-turbo-sst/commit/99259681c1fa1f82c33f8f34b69a572d07232dc3))
* expo auth ([#720](https://github.com/arlequins/template-t3-turbo-sst/issues/720)) ([390b1b1](https://github.com/arlequins/template-t3-turbo-sst/commit/390b1b18f8fad35bbd15bb860277a6df7510fa34))
* get renovate to update .hbs file ([#1064](https://github.com/arlequins/template-t3-turbo-sst/issues/1064)) ([24add42](https://github.com/arlequins/template-t3-turbo-sst/commit/24add42e37cfb7c27159cb6f8aa8eb03bc7d0a69))
* improve typescript editor performance ([#932](https://github.com/arlequins/template-t3-turbo-sst/issues/932)) ([5ac7165](https://github.com/arlequins/template-t3-turbo-sst/commit/5ac7165b59b374beb669aea211f6a0dcd473214e))
* **linter:** no unnecessary condition ([#968](https://github.com/arlequins/template-t3-turbo-sst/issues/968)) ([5db63fb](https://github.com/arlequins/template-t3-turbo-sst/commit/5db63fbaf5fbfebd1209e89bf345aa1d018c540e))
* **logging:** propagate request context through services ([d9f037e](https://github.com/arlequins/template-t3-turbo-sst/commit/d9f037e988d05dabacefb0c4fb2debae61030210))
* Next-15 & Expo-53 ([#1312](https://github.com/arlequins/template-t3-turbo-sst/issues/1312)) ([aba3d22](https://github.com/arlequins/template-t3-turbo-sst/commit/aba3d2225c56658c6186e81af1ac3849f21c8eed))
* nextauth v5 ([#697](https://github.com/arlequins/template-t3-turbo-sst/issues/697)) ([364904d](https://github.com/arlequins/template-t3-turbo-sst/commit/364904d740d47111a9e1e781e1bb9805681083d2))
* **observability:** add OpenTelemetry runtime ([#26](https://github.com/arlequins/template-t3-turbo-sst/issues/26)) ([1040c33](https://github.com/arlequins/template-t3-turbo-sst/commit/1040c33d87863ff6d035389d84a1e37759744801))
* **observability:** add tracing metrics and alarms ([ea5c7f0](https://github.com/arlequins/template-t3-turbo-sst/commit/ea5c7f02e666b3adb1cfdea79d8b89d59cac1f0b))
* **service:** add retry-safe mutations ([#41](https://github.com/arlequins/template-t3-turbo-sst/issues/41)) ([7c1f235](https://github.com/arlequins/template-t3-turbo-sst/commit/7c1f23556f9d0d937ab7478f1e2c03493b5bc382))
* **template:** add generic application baseline ([#30](https://github.com/arlequins/template-t3-turbo-sst/issues/30)) ([201f880](https://github.com/arlequins/template-t3-turbo-sst/commit/201f880929f619a53de809c18c1c4e8de2b14275))
* **template:** add portable project identity ([#33](https://github.com/arlequins/template-t3-turbo-sst/issues/33)) ([6c96ad5](https://github.com/arlequins/template-t3-turbo-sst/commit/6c96ad5b2714b7080162ddf42ad29c6c5e60f700))
* **tooling:** add clean architecture feature generator ([#43](https://github.com/arlequins/template-t3-turbo-sst/issues/43)) ([c6dd520](https://github.com/arlequins/template-t3-turbo-sst/commit/c6dd5203e302a1814261cb9ecde1541f748b5899))
* **tooling:** add safe template initialization ([4f431cd](https://github.com/arlequins/template-t3-turbo-sst/commit/4f431cdb934854468e0d3884a1fed511518aa59b))
* **tooling:** add selectable template presets ([f70b71e](https://github.com/arlequins/template-t3-turbo-sst/commit/f70b71e8a3357f185f2b3c5a4e1e50bb8476fc51))
* **tooling:** add template doctor ([#34](https://github.com/arlequins/template-t3-turbo-sst/issues/34)) ([a902445](https://github.com/arlequins/template-t3-turbo-sst/commit/a902445cf65e9de401a0fa03192a578d601fc269))
* **tooling:** complete template developer experience ([40f6e12](https://github.com/arlequins/template-t3-turbo-sst/commit/40f6e125d073fa6220efcc9baec900e5dd59d509))
* **tooling:** prune unselected template features ([dcd897e](https://github.com/arlequins/template-t3-turbo-sst/commit/dcd897ead6aa4419c5064e8098321a46bba05112))
* **tooling:** validate SST without AWS credentials ([236ded0](https://github.com/arlequins/template-t3-turbo-sst/commit/236ded08f01aa9c20caeaf8acbc42927e1dd48bc))
* trpc client for rsc ([#759](https://github.com/arlequins/template-t3-turbo-sst/issues/759)) ([2a5b8cb](https://github.com/arlequins/template-t3-turbo-sst/commit/2a5b8cb7a24bd9f27b3136f827a890ce843e7c66))
* ui-package ([#817](https://github.com/arlequins/template-t3-turbo-sst/issues/817)) ([fbf5d0d](https://github.com/arlequins/template-t3-turbo-sst/commit/fbf5d0df5fee65a3c0d7885c52f8d2f6affbe90e))
* use parsers for .hbs files ([#1063](https://github.com/arlequins/template-t3-turbo-sst/issues/1063)) ([13556a8](https://github.com/arlequins/template-t3-turbo-sst/commit/13556a8a09181329efacf149e18121d6af9ae8d4))
* **web:** add editorial blog template pages ([#29](https://github.com/arlequins/template-t3-turbo-sst/issues/29)) ([183c52d](https://github.com/arlequins/template-t3-turbo-sst/commit/183c52d087f780ae82c5321086ba6f8ed61f879d))


### Bug Fixes

* add eslintjs types ([#1216](https://github.com/arlequins/template-t3-turbo-sst/issues/1216)) ([e13e3c7](https://github.com/arlequins/template-t3-turbo-sst/commit/e13e3c7a5a804f1c351fdd1e115d2be03e3eed8d))
* auth trust host only in dev ([#1075](https://github.com/arlequins/template-t3-turbo-sst/issues/1075)) ([6b85186](https://github.com/arlequins/template-t3-turbo-sst/commit/6b851860f35fdd027e5d8d93b94c4ba2cdf3d49f))
* **auth:** isolate server environment validation ([ab1534e](https://github.com/arlequins/template-t3-turbo-sst/commit/ab1534ee5372cb7fc85c7b12185704ae1a043b06))
* bad bump ([40f41a5](https://github.com/arlequins/template-t3-turbo-sst/commit/40f41a539c2293de1bb592915cae0d3c85101989))
* change template for t3-turbo-sst ([#1](https://github.com/arlequins/template-t3-turbo-sst/issues/1)) ([f9a8ee2](https://github.com/arlequins/template-t3-turbo-sst/commit/f9a8ee229cd02bb631db64b4f0c9c79a5aa7dd93))
* **ci:** enable releases with GitHub token ([#48](https://github.com/arlequins/template-t3-turbo-sst/issues/48)) ([c6ae828](https://github.com/arlequins/template-t3-turbo-sst/commit/c6ae82812d4a20ec55758d67254f73aa01172857))
* **ci:** make clean workspace validation portable ([b69c149](https://github.com/arlequins/template-t3-turbo-sst/commit/b69c149bbe0712bb1b94dbc4de7aaaef72e38a95))
* **ci:** tolerate optional repository integrations ([38c06f5](https://github.com/arlequins/template-t3-turbo-sst/commit/38c06f50aded99e159012781d8af2b689be28a40))
* **db:** Export sql and aggregation functions ([#980](https://github.com/arlequins/template-t3-turbo-sst/issues/980)) ([0b05261](https://github.com/arlequins/template-t3-turbo-sst/commit/0b0526144830c80c78b3498d51f70fd20c5e6cf1))
* **deps:** Integrate expo-dev-client for enhanced capabilities in Expo bare builds ([#636](https://github.com/arlequins/template-t3-turbo-sst/issues/636)) ([#938](https://github.com/arlequins/template-t3-turbo-sst/issues/938)) ([30fe5de](https://github.com/arlequins/template-t3-turbo-sst/commit/30fe5dea10e52832541337740d1db123f9f1988e))
* **deps:** update dependency @auth/core to ^0.18.4 ([#747](https://github.com/arlequins/template-t3-turbo-sst/issues/747)) ([b7e9bbf](https://github.com/arlequins/template-t3-turbo-sst/commit/b7e9bbf1c92efe120da20e21e1118048cebd2c4a))
* **deps:** update dependency @auth/core to ^0.19.0 ([#803](https://github.com/arlequins/template-t3-turbo-sst/issues/803)) ([5ae6531](https://github.com/arlequins/template-t3-turbo-sst/commit/5ae6531911cfa7731bfdc219eddbb27dd767217c))
* **deps:** update dependency @auth/core to v0.28.1 ([#940](https://github.com/arlequins/template-t3-turbo-sst/issues/940)) ([06e78f1](https://github.com/arlequins/template-t3-turbo-sst/commit/06e78f10a65872d72984389edacdd1a6f46ce2df))
* **deps:** update dependency @auth/drizzle-adapter to ^0.3.12 ([#818](https://github.com/arlequins/template-t3-turbo-sst/issues/818)) ([a69a778](https://github.com/arlequins/template-t3-turbo-sst/commit/a69a7784be08d32aa183d4476de94eef274a3203))
* **deps:** update dependency @auth/drizzle-adapter to ^0.3.8 ([#750](https://github.com/arlequins/template-t3-turbo-sst/issues/750)) ([361f625](https://github.com/arlequins/template-t3-turbo-sst/commit/361f6253c0ef6c919ef06c218eff6f5179f2a332))
* **deps:** update dependency @auth/drizzle-adapter to ^0.3.9 ([#770](https://github.com/arlequins/template-t3-turbo-sst/issues/770)) ([6377fd4](https://github.com/arlequins/template-t3-turbo-sst/commit/6377fd471261c7a609c2aa6ee8954d9af7f2a5a8))
* **deps:** update dependency @auth/drizzle-adapter to ^0.8.0 ([#933](https://github.com/arlequins/template-t3-turbo-sst/issues/933)) ([0f0c6d4](https://github.com/arlequins/template-t3-turbo-sst/commit/0f0c6d4299bf8f52f68d1e5299d95edd8880881d))
* **deps:** update dependency @auth/drizzle-adapter to ^0.8.1 ([#941](https://github.com/arlequins/template-t3-turbo-sst/issues/941)) ([1e26df5](https://github.com/arlequins/template-t3-turbo-sst/commit/1e26df55233fbaffa9256ec7e3b97183b548a661))
* **deps:** update dependency @expo/metro-config to ^0.18.3 ([#1017](https://github.com/arlequins/template-t3-turbo-sst/issues/1017)) ([bf2f938](https://github.com/arlequins/template-t3-turbo-sst/commit/bf2f9389bf15356d4decf3134d4ac59931ee6fd4))
* **deps:** update dependency @hookform/resolvers to ^3.3.4 ([#831](https://github.com/arlequins/template-t3-turbo-sst/issues/831)) ([3d5e31e](https://github.com/arlequins/template-t3-turbo-sst/commit/3d5e31eee46f6175960501fa63e8a9bb943212db))
* **deps:** update dependency @planetscale/database to ^1.13.0 ([#809](https://github.com/arlequins/template-t3-turbo-sst/issues/809)) ([f60ba10](https://github.com/arlequins/template-t3-turbo-sst/commit/f60ba104fa28899152ac601cfb5cdc5e4a73cded))
* **deps:** update dependency @planetscale/database to ^1.16.0 ([#883](https://github.com/arlequins/template-t3-turbo-sst/issues/883)) ([8d6508f](https://github.com/arlequins/template-t3-turbo-sst/commit/8d6508f07e4f0be26c3cfeb50fc09054b82fa3b6))
* **deps:** update dependency @t3-oss/env-core to ^0.10.1 ([#1007](https://github.com/arlequins/template-t3-turbo-sst/issues/1007)) ([96fb43e](https://github.com/arlequins/template-t3-turbo-sst/commit/96fb43e72c4c23e663ad12339c8d4fb603d7add4))
* **deps:** update dependency @t3-oss/env-nextjs to ^0.11.1 ([#1173](https://github.com/arlequins/template-t3-turbo-sst/issues/1173)) ([86c5f88](https://github.com/arlequins/template-t3-turbo-sst/commit/86c5f8898ec67de0c1af6a893f64f1476fb40bb9))
* **deps:** update dependency @tanstack/react-query to ^5.28.6 ([#862](https://github.com/arlequins/template-t3-turbo-sst/issues/862)) ([5dcdff5](https://github.com/arlequins/template-t3-turbo-sst/commit/5dcdff57912d565b00585a3978099912dd8a85c4))
* **deps:** update dependency @tanstack/react-query to ^5.29.0 ([#939](https://github.com/arlequins/template-t3-turbo-sst/issues/939)) ([29921ce](https://github.com/arlequins/template-t3-turbo-sst/commit/29921cee954d4d079008d870a4ad927bd30b03b8))
* **deps:** update dependency @tanstack/react-query to ^5.32.0 ([#987](https://github.com/arlequins/template-t3-turbo-sst/issues/987)) ([1e78494](https://github.com/arlequins/template-t3-turbo-sst/commit/1e78494ff8158173baf07a4c5818fb8c7e59a7aa))
* **deps:** update dependency @tanstack/react-query to ^5.35.5 ([#1027](https://github.com/arlequins/template-t3-turbo-sst/issues/1027)) ([e32b502](https://github.com/arlequins/template-t3-turbo-sst/commit/e32b50214515e01560aece576873a3fa8ec90052))
* **deps:** update dependency @tanstack/react-query-devtools to ^5.4.2 ([#702](https://github.com/arlequins/template-t3-turbo-sst/issues/702)) ([a1d192d](https://github.com/arlequins/template-t3-turbo-sst/commit/a1d192d11190df99f51b064a10cfb160e545a010))
* **deps:** update dependency @tanstack/react-query-next-experimental to v5.18.0 [security] ([#869](https://github.com/arlequins/template-t3-turbo-sst/issues/869)) ([9a497fd](https://github.com/arlequins/template-t3-turbo-sst/commit/9a497fd1159f1e5ef074df20ff6cca13ba8f03d6))
* **deps:** update dependency autoprefixer to ^10.4.17 ([#855](https://github.com/arlequins/template-t3-turbo-sst/issues/855)) ([8ee017d](https://github.com/arlequins/template-t3-turbo-sst/commit/8ee017d7bd5f74de48cafda18f7132ed16b259a2))
* **deps:** update dependency drizzle-orm to ^0.29.0 ([#745](https://github.com/arlequins/template-t3-turbo-sst/issues/745)) ([d986c78](https://github.com/arlequins/template-t3-turbo-sst/commit/d986c780be8dc78dce2543fb0d66560b05734c55))
* **deps:** update dependency drizzle-orm to ^0.30.4 ([#934](https://github.com/arlequins/template-t3-turbo-sst/issues/934)) ([eb01df1](https://github.com/arlequins/template-t3-turbo-sst/commit/eb01df1d4b231ac735a579b41dc9e113c8be5903))
* **deps:** update dependency eslint-config-prettier to ^9.1.0 ([#778](https://github.com/arlequins/template-t3-turbo-sst/issues/778)) ([f0818d4](https://github.com/arlequins/template-t3-turbo-sst/commit/f0818d437c29e8f9a8a36c6cf185034f07c37eac))
* **deps:** update dependency eslint-plugin-import to ^2.29.0 ([#704](https://github.com/arlequins/template-t3-turbo-sst/issues/704)) ([2ba40a5](https://github.com/arlequins/template-t3-turbo-sst/commit/2ba40a5f53d6d57c1120ccac6a1bdd8f3986f6a0))
* **deps:** update dependency eslint-plugin-import to ^2.29.1 ([#804](https://github.com/arlequins/template-t3-turbo-sst/issues/804)) ([3b56c13](https://github.com/arlequins/template-t3-turbo-sst/commit/3b56c13fead3ea96b98f03754d40b7360121dc5d))
* **deps:** update dependency eslint-plugin-jsx-a11y to ^6.8.0 ([#722](https://github.com/arlequins/template-t3-turbo-sst/issues/722)) ([422f95a](https://github.com/arlequins/template-t3-turbo-sst/commit/422f95a73f136de8377eb6b071b932e03b5c0f91))
* **deps:** update dependency expo to ^49.0.18 ([#736](https://github.com/arlequins/template-t3-turbo-sst/issues/736)) ([9c2e24f](https://github.com/arlequins/template-t3-turbo-sst/commit/9c2e24f10a1e2196957ce0e7812e5fa1ae557bf8))
* **deps:** update dependency expo to ^49.0.21 ([#761](https://github.com/arlequins/template-t3-turbo-sst/issues/761)) ([0266b7a](https://github.com/arlequins/template-t3-turbo-sst/commit/0266b7ae393edc0c279ea4e9b33d86954a161a41))
* **deps:** update dependency expo-router to v2.0.10 ([#692](https://github.com/arlequins/template-t3-turbo-sst/issues/692)) ([260d60e](https://github.com/arlequins/template-t3-turbo-sst/commit/260d60e5eff5af6f551e4fd13870df339f352a7e))
* **deps:** update dependency expo-router to v2.0.11 ([#732](https://github.com/arlequins/template-t3-turbo-sst/issues/732)) ([b2688da](https://github.com/arlequins/template-t3-turbo-sst/commit/b2688dabe88009f77c3eb00987173433852b73d1))
* **deps:** update dependency expo-router to v2.0.12 ([#746](https://github.com/arlequins/template-t3-turbo-sst/issues/746)) ([70a8e5d](https://github.com/arlequins/template-t3-turbo-sst/commit/70a8e5d89e487964b0753d70d8672c3db71880cb))
* **deps:** update dependency expo-router to v2.0.14 ([#766](https://github.com/arlequins/template-t3-turbo-sst/issues/766)) ([e8fa092](https://github.com/arlequins/template-t3-turbo-sst/commit/e8fa092b417c14a66395a9dcb276c8eb45b19898))
* **deps:** update dependency geist to ^1.2.1 ([#856](https://github.com/arlequins/template-t3-turbo-sst/issues/856)) ([cc6b66f](https://github.com/arlequins/template-t3-turbo-sst/commit/cc6b66f196607917b31bfe55570c2d8dcced17b2))
* **deps:** update dependency geist to ^1.3.0 ([#943](https://github.com/arlequins/template-t3-turbo-sst/issues/943)) ([a96ebbf](https://github.com/arlequins/template-t3-turbo-sst/commit/a96ebbfee79b6fc1cdfeee961dd3df72746831c6))
* **deps:** update dependency nativewind to ^4.0.13 ([#724](https://github.com/arlequins/template-t3-turbo-sst/issues/724)) ([aa6fab7](https://github.com/arlequins/template-t3-turbo-sst/commit/aa6fab78634bbb5600e3d654f11b80c27028709f))
* **deps:** update dependency nativewind to ^4.0.16 ([#767](https://github.com/arlequins/template-t3-turbo-sst/issues/767)) ([3d1a637](https://github.com/arlequins/template-t3-turbo-sst/commit/3d1a63782712723aeb8d7a0051077764ffa66dfd))
* **deps:** update dependency nativewind to ^4.0.22 ([#819](https://github.com/arlequins/template-t3-turbo-sst/issues/819)) ([a7b639f](https://github.com/arlequins/template-t3-turbo-sst/commit/a7b639fac386157174d7b739d10b3289571a88f9))
* **deps:** update dependency nativewind to ~4.0.23 ([#857](https://github.com/arlequins/template-t3-turbo-sst/issues/857)) ([a87d796](https://github.com/arlequins/template-t3-turbo-sst/commit/a87d79647e3fb6e20274bc0a7057c86eea1fc0bc))
* **deps:** update dependency next to v14.2.21 [security] ([#1278](https://github.com/arlequins/template-t3-turbo-sst/issues/1278)) ([7f398ac](https://github.com/arlequins/template-t3-turbo-sst/commit/7f398ac2be23e9f151ff4d616072f9a23e75fec5))
* **deps:** update dependency next-auth to v5.0.0-beta.12 ([#892](https://github.com/arlequins/template-t3-turbo-sst/issues/892)) ([b3f9cbb](https://github.com/arlequins/template-t3-turbo-sst/commit/b3f9cbb7c1f477dd36684535fd357f4e70d9b1fd))
* **deps:** update dependency next-auth to v5.0.0-beta.15 ([#911](https://github.com/arlequins/template-t3-turbo-sst/issues/911)) ([297a478](https://github.com/arlequins/template-t3-turbo-sst/commit/297a4782a6d68923ec24960fef466c12abe12bc6))
* **deps:** update dependency next-auth to v5.0.0-beta.16 ([#942](https://github.com/arlequins/template-t3-turbo-sst/issues/942)) ([30de515](https://github.com/arlequins/template-t3-turbo-sst/commit/30de5150f71af6e40da0513a8f5c99dd818d5f86))
* **deps:** update dependency next-auth to v5.0.0-beta.4 ([#773](https://github.com/arlequins/template-t3-turbo-sst/issues/773)) ([67079f7](https://github.com/arlequins/template-t3-turbo-sst/commit/67079f72ae8236f71b746b6ed7cdd8bd234857f0))
* **deps:** update dependency next-themes to ^0.3.0 ([#935](https://github.com/arlequins/template-t3-turbo-sst/issues/935)) ([3bfc85a](https://github.com/arlequins/template-t3-turbo-sst/commit/3bfc85ab6502b009aa7c0029fccc35ac6a7f6eb0))
* **deps:** update dependency next-themes to ^0.4.6 ([#1326](https://github.com/arlequins/template-t3-turbo-sst/issues/1326)) ([2b4ca4c](https://github.com/arlequins/template-t3-turbo-sst/commit/2b4ca4c235062579fd2b23da6e984bae6b6d3b4a))
* **deps:** update dependency prettier-plugin-tailwindcss to ^0.5.13 ([#928](https://github.com/arlequins/template-t3-turbo-sst/issues/928)) ([0594a7b](https://github.com/arlequins/template-t3-turbo-sst/commit/0594a7bbc17d3be6014e46f03980bc5abf4cde24))
* **deps:** update dependency prettier-plugin-tailwindcss to ^0.5.7 ([#737](https://github.com/arlequins/template-t3-turbo-sst/issues/737)) ([5faddf0](https://github.com/arlequins/template-t3-turbo-sst/commit/5faddf00e7587e4c156b17e8dce9752966dc95c7))
* **deps:** update dependency prettier-plugin-tailwindcss to ^0.5.9 ([#783](https://github.com/arlequins/template-t3-turbo-sst/issues/783)) ([497d0ae](https://github.com/arlequins/template-t3-turbo-sst/commit/497d0ae3232b7d5ad37c9b7e9fd1fa68f6681b19))
* **deps:** update dependency react-native to ~0.73.5 ([#906](https://github.com/arlequins/template-t3-turbo-sst/issues/906)) ([197810d](https://github.com/arlequins/template-t3-turbo-sst/commit/197810d2ccce289413368c61f1e27d1003b5afe5))
* **deps:** update dependency react-native to ~0.74.3 ([#1074](https://github.com/arlequins/template-t3-turbo-sst/issues/1074)) ([be56cc6](https://github.com/arlequins/template-t3-turbo-sst/commit/be56cc635f8e115eb22df6de41e2a584076f16fd))
* **deps:** update dependency react-native to v0.72.6 ([#693](https://github.com/arlequins/template-t3-turbo-sst/issues/693)) ([503d260](https://github.com/arlequins/template-t3-turbo-sst/commit/503d260c2458f4748593057b31735eaa08fd4795))
* **deps:** update dependency react-native to v0.72.7 ([#756](https://github.com/arlequins/template-t3-turbo-sst/issues/756)) ([89fd0db](https://github.com/arlequins/template-t3-turbo-sst/commit/89fd0dbbdcf345a9765b4db1ab2dc073001abbce))
* **deps:** update dependency react-native to v0.73.0 ([#787](https://github.com/arlequins/template-t3-turbo-sst/issues/787)) ([b2ffac5](https://github.com/arlequins/template-t3-turbo-sst/commit/b2ffac57ec9873c93d83815c87b7114d5da0db85))
* **deps:** update dependency react-native to v0.73.1 ([#806](https://github.com/arlequins/template-t3-turbo-sst/issues/806)) ([4afe8fa](https://github.com/arlequins/template-t3-turbo-sst/commit/4afe8fac41b2bf327edb686c2c45386f27a9e4a8))
* **deps:** update dependency react-native-css-interop to ~0.0.34 ([#895](https://github.com/arlequins/template-t3-turbo-sst/issues/895)) ([e6d9484](https://github.com/arlequins/template-t3-turbo-sst/commit/e6d948493e95cdd179f6ad590313d2caaaf5f50c))
* **deps:** update dependency react-native-gesture-handler to ~2.16.2 ([#881](https://github.com/arlequins/template-t3-turbo-sst/issues/881)) ([a88280d](https://github.com/arlequins/template-t3-turbo-sst/commit/a88280d6d754395f18ffce489e6a110a76285aa0))
* **deps:** update dependency react-native-reanimated to ~3.8.1 ([#882](https://github.com/arlequins/template-t3-turbo-sst/issues/882)) ([ae8f447](https://github.com/arlequins/template-t3-turbo-sst/commit/ae8f4477484b59e40e304d1fc0b02e403fe1bce5))
* **deps:** update dependency sonner to ^1.4.1 ([#897](https://github.com/arlequins/template-t3-turbo-sst/issues/897)) ([4ccf544](https://github.com/arlequins/template-t3-turbo-sst/commit/4ccf544e7ebe4b144577a893f945cf81255581f3))
* **deps:** update dependency sonner to ^1.4.3 ([#905](https://github.com/arlequins/template-t3-turbo-sst/issues/905)) ([032aca7](https://github.com/arlequins/template-t3-turbo-sst/commit/032aca720acbcfec244bc499333faea77c6b9320))
* **deps:** update dependency superjson to v2 ([#709](https://github.com/arlequins/template-t3-turbo-sst/issues/709)) ([6fc6e93](https://github.com/arlequins/template-t3-turbo-sst/commit/6fc6e93efd6a299eb02ab4446146c36771253bd6))
* **deps:** update dependency superjson to v2.2.1 ([#740](https://github.com/arlequins/template-t3-turbo-sst/issues/740)) ([50a1965](https://github.com/arlequins/template-t3-turbo-sst/commit/50a1965501bc25858778ffcfe1584f36a122862f))
* **deps:** update dependency tailwindcss to ^3.4.3 ([#976](https://github.com/arlequins/template-t3-turbo-sst/issues/976)) ([310c2ab](https://github.com/arlequins/template-t3-turbo-sst/commit/310c2ab6de10c95e790c998b0ce3c92d8d2f57b4))
* **deps:** update dependency tailwindcss to v3.3.5 ([#695](https://github.com/arlequins/template-t3-turbo-sst/issues/695)) ([70dfae2](https://github.com/arlequins/template-t3-turbo-sst/commit/70dfae26799316ec988924dd4dd8f3319696d51a))
* **deps:** update dependency tailwindcss to v3.4.0 ([#784](https://github.com/arlequins/template-t3-turbo-sst/issues/784)) ([1fabe3c](https://github.com/arlequins/template-t3-turbo-sst/commit/1fabe3c9ee9ff1912565dac022b0985f5e1c2266))
* **deps:** update dependency zod to ^3.23.8 ([#1028](https://github.com/arlequins/template-t3-turbo-sst/issues/1028)) ([eae5c74](https://github.com/arlequins/template-t3-turbo-sst/commit/eae5c74cd970146dd7968cc2364a058b32289643))
* **deps:** update expo monorepo ([#1033](https://github.com/arlequins/template-t3-turbo-sst/issues/1033)) ([8653874](https://github.com/arlequins/template-t3-turbo-sst/commit/8653874e975a75b42d4610641555e8f287b6a037))
* **deps:** update expo monorepo ([#1448](https://github.com/arlequins/template-t3-turbo-sst/issues/1448)) ([111ffd5](https://github.com/arlequins/template-t3-turbo-sst/commit/111ffd5af4db73228d6bc16fdd5b72b76f941f52))
* **deps:** update expo monorepo ([#650](https://github.com/arlequins/template-t3-turbo-sst/issues/650)) ([d71bbfa](https://github.com/arlequins/template-t3-turbo-sst/commit/d71bbfaa0da94c732d24cd92fb9270e7b4e75241))
* **deps:** update nextjs monorepo to ^14.0.1 ([#703](https://github.com/arlequins/template-t3-turbo-sst/issues/703)) ([94c1a73](https://github.com/arlequins/template-t3-turbo-sst/commit/94c1a7349b26083f2c2f494f4119ba63e4d55c55))
* **deps:** update nextjs monorepo to ^14.0.2 ([#742](https://github.com/arlequins/template-t3-turbo-sst/issues/742)) ([e74c170](https://github.com/arlequins/template-t3-turbo-sst/commit/e74c170a0eb9bfe35ec9f592f7c0c7c7ac380512))
* **deps:** update nextjs monorepo to ^14.0.3 ([#768](https://github.com/arlequins/template-t3-turbo-sst/issues/768)) ([5272139](https://github.com/arlequins/template-t3-turbo-sst/commit/527213983b81ecce21ada3ae92a39a73b775a392))
* **deps:** update nextjs monorepo to ^14.2.23 ([#1289](https://github.com/arlequins/template-t3-turbo-sst/issues/1289)) ([e50bed7](https://github.com/arlequins/template-t3-turbo-sst/commit/e50bed702cf19be29af087c57783724810a4ae48))
* **deps:** update tanstack-query monorepo ([#710](https://github.com/arlequins/template-t3-turbo-sst/issues/710)) ([5604493](https://github.com/arlequins/template-t3-turbo-sst/commit/5604493bdae813d87501ca9c907de32b998e07ad))
* **deps:** update tanstack-query monorepo to ^5.17.7 ([#823](https://github.com/arlequins/template-t3-turbo-sst/issues/823)) ([ccdcb11](https://github.com/arlequins/template-t3-turbo-sst/commit/ccdcb115d3d3f3420078a549394e6eeb6373d598))
* **deps:** update tanstack-query monorepo to ^5.8.1 ([#727](https://github.com/arlequins/template-t3-turbo-sst/issues/727)) ([4d1891e](https://github.com/arlequins/template-t3-turbo-sst/commit/4d1891e91c830bad1c911d93e23f2fe10ea2bdb3))
* **deps:** update tanstack-query monorepo to ^5.8.7 ([#751](https://github.com/arlequins/template-t3-turbo-sst/issues/751)) ([3295956](https://github.com/arlequins/template-t3-turbo-sst/commit/32959565820291a41dc8283294261a45103ca8c0))
* **deps:** update trpc monorepo to v11.0.0-next-beta.294 ([#863](https://github.com/arlequins/template-t3-turbo-sst/issues/863)) ([614be01](https://github.com/arlequins/template-t3-turbo-sst/commit/614be012a2067199d28490b899cfaad035dd661c))
* **deps:** update trpc monorepo to v11.0.0-rc.364 ([#977](https://github.com/arlequins/template-t3-turbo-sst/issues/977)) ([4c539ae](https://github.com/arlequins/template-t3-turbo-sst/commit/4c539ae4d36a8701b3379799184d7f05ee7ac209))
* **deps:** update turbo monorepo to ^1.10.16 ([#699](https://github.com/arlequins/template-t3-turbo-sst/issues/699)) ([7b721c7](https://github.com/arlequins/template-t3-turbo-sst/commit/7b721c7cc88efab90701f9071c70196b1b72067e))
* **deps:** update turbo monorepo to ^2.3.3 ([#1266](https://github.com/arlequins/template-t3-turbo-sst/issues/1266)) ([0ce1b91](https://github.com/arlequins/template-t3-turbo-sst/commit/0ce1b91d322033851eb0197b60fc6dd6359e55aa))
* **deps:** update typescript-eslint monorepo to ^6.10.0 ([#730](https://github.com/arlequins/template-t3-turbo-sst/issues/730)) ([e6cde6e](https://github.com/arlequins/template-t3-turbo-sst/commit/e6cde6e606a8828f0e244f828f88036da59c3592))
* **deps:** update typescript-eslint monorepo to ^6.19.1 ([#824](https://github.com/arlequins/template-t3-turbo-sst/issues/824)) ([a4b746e](https://github.com/arlequins/template-t3-turbo-sst/commit/a4b746e9874240af76a550f50c1745df2d9e3139))
* **deps:** update typescript-eslint monorepo to ^6.9.0 ([#706](https://github.com/arlequins/template-t3-turbo-sst/issues/706)) ([08067ca](https://github.com/arlequins/template-t3-turbo-sst/commit/08067ca55520b689db731a9913ba52bbf704799e))
* **deps:** update typescript-eslint monorepo to ^6.9.1 ([#716](https://github.com/arlequins/template-t3-turbo-sst/issues/716)) ([6ac3547](https://github.com/arlequins/template-t3-turbo-sst/commit/6ac3547897945224e73a4cddddd35c0b58f9e823))
* **deps:** update typescript-eslint monorepo to ^7.2.0 ([#907](https://github.com/arlequins/template-t3-turbo-sst/issues/907)) ([b982284](https://github.com/arlequins/template-t3-turbo-sst/commit/b9822841865c357b73bff0ce1c578c16a87dcf1d))
* **deps:** update typescript-eslint monorepo to ^7.4.0 ([#946](https://github.com/arlequins/template-t3-turbo-sst/issues/946)) ([4a0db23](https://github.com/arlequins/template-t3-turbo-sst/commit/4a0db23de6d1988637b66b94618c683df9a4ab0e))
* **deps:** update typescript-eslint monorepo to v7 ([#887](https://github.com/arlequins/template-t3-turbo-sst/issues/887)) ([7c17f38](https://github.com/arlequins/template-t3-turbo-sst/commit/7c17f38c73540a7a68931529d7d56e3c25f09857))
* **dev:** avoid local PostgreSQL port conflicts ([25746ec](https://github.com/arlequins/template-t3-turbo-sst/commit/25746ec79a64aa9d533dbef569d94300ea5a7620))
* disable edge runtime by default to enable windows development ([#1281](https://github.com/arlequins/template-t3-turbo-sst/issues/1281)) ([d6c3953](https://github.com/arlequins/template-t3-turbo-sst/commit/d6c3953f24f63af842d7c34b9d14ca92340bf43e))
* **docs:** clean up some typos in README.md ([#893](https://github.com/arlequins/template-t3-turbo-sst/issues/893)) ([f7a3749](https://github.com/arlequins/template-t3-turbo-sst/commit/f7a3749278fde3be1226ab2bd2de82aec6d48c05))
* eslint added flag for ts ([#1440](https://github.com/arlequins/template-t3-turbo-sst/issues/1440)) ([da4c5ba](https://github.com/arlequins/template-t3-turbo-sst/commit/da4c5babaaaf2e76d403d9f082344af501307a1a))
* **expo:** Revert `node-linker=hoisted` change ([#870](https://github.com/arlequins/template-t3-turbo-sst/issues/870)) ([7c1da52](https://github.com/arlequins/template-t3-turbo-sst/commit/7c1da52c6fdfe108d8b9644047308c3e75a58214))
* fix nativewind v5 ([#1473](https://github.com/arlequins/template-t3-turbo-sst/issues/1473)) ([268959d](https://github.com/arlequins/template-t3-turbo-sst/commit/268959ded311d6ff925a384c83922c8f88847031))
* format script for windwos ([#758](https://github.com/arlequins/template-t3-turbo-sst/issues/758)) ([bc77bf7](https://github.com/arlequins/template-t3-turbo-sst/commit/bc77bf7f550f25c11735fbe004f05df11d78ff28)), closes [#755](https://github.com/arlequins/template-t3-turbo-sst/issues/755)
* Metro config ([#909](https://github.com/arlequins/template-t3-turbo-sst/issues/909)) ([e2f479f](https://github.com/arlequins/template-t3-turbo-sst/commit/e2f479fcc9e6c1efc82dda03389ec9bff0d115b9))
* pnpm and android builds ([#560](https://github.com/arlequins/template-t3-turbo-sst/issues/560)) ([a376187](https://github.com/arlequins/template-t3-turbo-sst/commit/a376187ca81436dd6ecc45d200fd60d4ab993a2e))
* prettier overwrites @typescript-eslint/consistent-type-imports   ([#794](https://github.com/arlequins/template-t3-turbo-sst/issues/794)) ([c10c427](https://github.com/arlequins/template-t3-turbo-sst/commit/c10c4271dbd647947c077c8c37e1ac066ad458ea))
* slice token bearer prefix in invalidate function ([#1168](https://github.com/arlequins/template-t3-turbo-sst/issues/1168)) ([f4b6caf](https://github.com/arlequins/template-t3-turbo-sst/commit/f4b6caf91aa6b92bcb920ebfac285e24113e95a3))
* **test:** make CI fixtures deterministic ([5bd4b0c](https://github.com/arlequins/template-t3-turbo-sst/commit/5bd4b0c008a4b2e0fdc554f1e628887f03adc081))
* **tooling:** address stacked PR review findings ([2383a2d](https://github.com/arlequins/template-t3-turbo-sst/commit/2383a2d74e766dfc4cf621e0dc37e88970bc42ac))
* **tooling:** redact secret synchronization logs ([#46](https://github.com/arlequins/template-t3-turbo-sst/issues/46)) ([bd52104](https://github.com/arlequins/template-t3-turbo-sst/commit/bd5210452d889ae3382326d6d21bcfdd6bdfdf16))
* typo in eslint version ([#904](https://github.com/arlequins/template-t3-turbo-sst/issues/904)) ([4540588](https://github.com/arlequins/template-t3-turbo-sst/commit/45405886ec9a045c7fa35ef5e95104b0dd631739))
* **ui:** preserve disabled button contrast ([cfe8132](https://github.com/arlequins/template-t3-turbo-sst/commit/cfe8132c69c7fc795481e5ac59a75f9ac640af89))
* update compoundKey to fix deprecation message ([#829](https://github.com/arlequins/template-t3-turbo-sst/issues/829)) ([275f590](https://github.com/arlequins/template-t3-turbo-sst/commit/275f5901e56188381c2a14a4af67fedd03af940e))
* update Turborepo schema URLs to use the correct domain ([#1371](https://github.com/arlequins/template-t3-turbo-sst/issues/1371)) ([6a50e59](https://github.com/arlequins/template-t3-turbo-sst/commit/6a50e593f32b5f502b208eff997b9b0df14f3115))
* update typescript-eslint to 8.3.0 ([#1167](https://github.com/arlequins/template-t3-turbo-sst/issues/1167)) ([ef8a126](https://github.com/arlequins/template-t3-turbo-sst/commit/ef8a1263a9026c86454eada77ace7c9d0e8072f2))
* use `localLink` to invoke procedures directly during SSR ([#1480](https://github.com/arlequins/template-t3-turbo-sst/issues/1480)) ([3204fbe](https://github.com/arlequins/template-t3-turbo-sst/commit/3204fbe82f053c7b6b456fccc03ee71f92fdf56c))
* use correct node and pnpm versions in eas.json ([#1285](https://github.com/arlequins/template-t3-turbo-sst/issues/1285)) ([9998e00](https://github.com/arlequins/template-t3-turbo-sst/commit/9998e00ca0ec2cf15ee6f7cd1ceb1f9d12685ff3))
* use sherif in generator ([#738](https://github.com/arlequins/template-t3-turbo-sst/issues/738)) ([1525d83](https://github.com/arlequins/template-t3-turbo-sst/commit/1525d83dd9d1a8a01812e77d498c2b4fb4a60609))
* watch issue ([#1116](https://github.com/arlequins/template-t3-turbo-sst/issues/1116)) ([a1241f5](https://github.com/arlequins/template-t3-turbo-sst/commit/a1241f58bf27ce817d4784ccf3ce37479a687b94))
* wrong column type for access_token ([#828](https://github.com/arlequins/template-t3-turbo-sst/issues/828)) ([bb7d386](https://github.com/arlequins/template-t3-turbo-sst/commit/bb7d386e38a8a0845e5bd69298919b2d4a3e7290))

## [1.1.0] - 2026-07-22

### Added

- Interactive OpenAPI documentation with an API request explorer and browser E2E coverage.
- Clean Architecture feature generator for domain, port, use-case, adaptor, composition, router, and test scaffolding.
- Provider-neutral asynchronous messaging ports with in-memory and AWS adaptors.
- Retry-safe mutation support backed by idempotency keys and optimistic content versioning.
- Resilient S3 cache policies for stale reads, retry backoff, request coalescing, and observability hooks.
- Isolated database integration tests powered by Testcontainers.
- Responsive Playwright visual regression coverage for desktop and mobile layouts.
- Template doctor and feature-matrix checks for generated project qualification.

### Changed

- Standardized application errors across the service, tRPC, and Hono API layers.
- Enforced dead-code and dependency analysis in local tooling and CI.
- Expanded CI to validate database migrations, generated presets, architecture boundaries, Storybook, and browser workflows.

### Fixed

- Made template environment-file updates atomic.
- Stabilized cross-platform visual snapshots with fixed viewport baselines and platform rendering tolerance.

## [1.0.1] - 2026-04-10

### Added

- **`@acme/shared`** — cross-cutting helpers; exports `runDrizzleSeeds` from `@acme/shared/seed` for TypeScript-based Drizzle seeds (ledger table, `SST_STAGE` via `resolveDeployStage()`).
- **`@acme/types`** — shared types including `SeedContext` / `SeedRun` for seed modules.

### Changed

- **`@acme/db-backbone`** — `scripts/seed.ts` delegates to `runDrizzleSeeds`; seed files live under `packages/db-backbone/scripts/seeds/*.ts` (default export). Drizzle-related dependencies use **`catalog:`** entries.
- **Root `pnpm-workspace.yaml`** — `catalog` lists `drizzle-orm`, `drizzle-zod`, `drizzle-kit`, `postgres`, and `tsx` for consistent versions across packages.

### Docs

- Root [`README.md`](./README.md): database seed command, packages index link, pnpm catalog note.
- [`packages/README.md`](./packages/README.md), [`packages/db-backbone/README.md`](./packages/db-backbone/README.md), [`packages/shared/README.md`](./packages/shared/README.md), [`packages/types/README.md`](./packages/types/README.md).

## [1.0.0] - 2026-04-09

### Summary

- **Initial stable release.** Inspired by T3 / [create-t3-turbo](https://github.com/t3-oss/create-t3-turbo), but AWS deployment, batch jobs, and shared packages diverge significantly (see README _How this differs from a stock T3 template_).

### Included

- **Apps:** `apps/web` (Next.js static export + tRPC client), `apps/api` (TanStack Start + tRPC + Nitro on AWS), `apps/batch` (SST Step Functions + Lambda + EventBridge Cron).
- **Shared packages:** `@acme/db-backbone`, `@acme/trpc`, `@acme/ui`, `@acme/env`, `@acme/validators`, `@acme/types`, `@acme/shared`, etc.
- **Infrastructure:** SST (Ion) on AWS; `tooling/sst-bootstrap` for Secrets Manager ↔ root `.env` sync.
- **Tooling:** Turborepo, pnpm workspaces, and Biome.

### Docs

- Root README updated with tech stack, T3 divergence note, and repository layout.
