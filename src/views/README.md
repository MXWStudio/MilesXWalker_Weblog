# views 目录说明

本目录用于存放所有页面级 Vue 组件（即路由页面）。

- 每个页面建议单独一个 .vue 文件，文件名与路由/页面功能一致。
- 复杂页面可建立子目录（如 photos/Index.vue、videos/Index.vue）。
- 页面内可引用 components 目录下的各种复用组件。

## 页面级组件

本目录用于存放每个路由页面的主组件，每个文件对应一个页面。

- 命名建议：每个页面一个 .vue 文件，文件名与路由/页面功能一致（如 Home.vue、About.vue）。
- 页面内可引用 components 目录下的各种复用组件。
- 如某页面较复杂，可为其单独建子文件夹（如 photos/Index.vue、photos/Detail.vue）。

### 复杂页面建议

- Photos（照片作品页）：建议建立 photos/ 目录，包含 Index.vue（列表）、Detail.vue（详情）、components/（私有组件）等。
- Videos（视频作品页）：建议建立 videos/ 目录，包含 Index.vue（列表）、Detail.vue（详情）、components/（私有组件）等。 