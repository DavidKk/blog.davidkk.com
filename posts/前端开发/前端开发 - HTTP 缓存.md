
## 缓存头

### Cache-Control

- public (公共缓存): 表示可以被所有响应者缓存, 包括 代理, CDN等
- private (私有缓存): 表示仅被浏览器缓存
- no-store: 不缓存
- no-cache:
  - response: 并不是表示无缓存, 而是指使用缓存一定要先经过验证, 若未过期, 返回 304
  - (特殊) request: 跟 no-store 一样, 不缓存只请求最新的资源
- max-age: 表示最大缓存时间
  - response: `max-age=0` 表示使用缓存必须经过验证
- must-revalidate: 表示使用一个旧的资源时, 必须对旧资源进行验证, 已过期的资源将不会被使用
