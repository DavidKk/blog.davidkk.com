<!-- title: OpenWrt - IPv4 to IPv6 -->
<!-- author: <David Jones qowera@qq.com> -->
<!-- date: 2015-04-11 12:57:14 -->
<!-- category: OpenWrt -->
<!-- tag: OpenWrt,路由器,IPv4,IPv6 -->

## OpenWrt - IPv4 to IPv6

IPv4 将在不久将来淘汰掉了，IPv6 才是王道，只有部分城市与教育网拥有IPv6的地址。
我们通过 IPv6 隧道 来解决我们不拥有 IPv6 IP 的问题。

### 配置

首先允许来自外部的 ping 测试。

```
iptables -A INPUT -p icmp --icmp-type echo-request -j ACCEPT
iptables -A OUTPUT -p icmp --icmp-type echo-reply -j ACCEPT

iptables -D INPUT -p icmp --icmp-type echo-request -j ACCEPT
iptables -D OUTPUT -p icmp --icmp-type echo-reply -j ACCEPT



iptables -nL INPUT | awk '{print NR-2 " " $0}' |sed -ne '/icmp/{/DROP/p}'

# 66.220.2.74 为 tunnelbroker.net 中描述的服务器 IP，若配置这个可能会出现以下这个报错：
# IP is not ICMP pingable. Please make sure ICMP is not blocked. If you are blocking ICMP, please allow 66.220.2.74 through your firewall.

# 删除规则
# iptables -D INPUT -p icmp --icmp-type echo-request -j ACCEPT
# iptables -D OUTPUT -p icmp --icmp-type echo-reply -j ACCEPT
```

现在我们可以进行 [https://tunnelbroker.net](https://tunnelbroker.net) 注册个账号并 `Create Regular Tunnel`。


